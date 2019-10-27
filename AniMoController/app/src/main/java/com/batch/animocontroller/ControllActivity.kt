package com.batch.animocontroller

import android.content.Context
import android.graphics.Color
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.Bundle
import android.os.Vibrator
import android.util.Log
import android.view.KeyEvent
import android.view.MotionEvent
import android.view.View
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.GestureDetectorCompat
import androidx.core.view.MotionEventCompat
import com.daimajia.androidanimations.library.Techniques
import com.daimajia.androidanimations.library.YoYo
import io.socket.client.IO
import io.socket.emitter.Emitter
import kotlinx.android.synthetic.main.activity_connect.view.*
import kotlinx.android.synthetic.main.activity_controll.*
import org.json.JSONObject
import java.lang.Exception
import kotlin.properties.Delegates

class ControllActivity : AppCompatActivity(), SensorEventListener, AniMoSwipe.Listener {

    private val socket = IO.socket("http://ec2-54-65-64-81.ap-northeast-1.compute.amazonaws.com")
    private var mManager: SensorManager by Delegates.notNull<SensorManager>()
    private var mSensor: Sensor by Delegates.notNull<Sensor>()
    private lateinit var gestureDetectorCompat: GestureDetectorCompat

    private var sensorxValues: MutableList<Float> = mutableListOf()
    private var sensoryValues: MutableList<Float> = mutableListOf()
    private var sensorzValues: MutableList<Float> = mutableListOf()
    private var changeValues: MutableList<Float> = mutableListOf()
    private val SENSORDELAY: Long = 300

    private var motionFlag = false
    private var animationType = "none"
    override fun onSensorChanged(event: SensorEvent) {
        if (event.sensor.type == Sensor.TYPE_ACCELEROMETER) {
            // 各軸のセンサを配列に入れる
            sensorxValues.add(event.values[0])
            sensoryValues.add(event.values[1])
            sensorzValues.add(event.values[2])

        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_controll)
        val vibrator = getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
        socket.connect()
        //センサーマネージャーを取得する
        mManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
        //加速度計のセンサーを取得する
        mSensor = mManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)

        val aniMoSwipe = AniMoSwipe(this)
        gestureDetectorCompat = GestureDetectorCompat(this, aniMoSwipe)


        nextImageView.setOnClickListener {
            val endpoint = "mobileSendNextSlideAction"
            val body = JSONObject(
                """{
                |"animType":"fadeOut",
                |"direction":"none"
                |}""".trimMargin()
            )
            socket
                .emit(endpoint, body, Emitter.Listener {
                })
                .on("webGoToNextSlide") {
                    try {
                        Log.d("batchResponse", it[0].toString())
                    } catch (e: Exception) {

                    }
                }
            vibrator.vibrate(longArrayOf(0, 30), -1)
        }

        prevImageView.setOnClickListener {
            val endpoint = "mobileSendPrevSlideAction"
            val body = JSONObject(
                """{
                |"animType":"fadeOut",
                |"direction":"none"
                |}""".trimMargin()
            )
            socket
                .emit(endpoint, body, Emitter.Listener {
                })
                .on("webReturnToPrevSlide") {
                    try {
                        Log.d("batchResponse", it[0].toString())
                    } catch (e: Exception) {

                    }
                }
            vibrator.vibrate(longArrayOf(0, 30), -1)
        }


        animationView.setOnLongClickListener {
            vibrator.vibrate(longArrayOf(0, 30), -1)
            false
        }
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        when (keyCode) {
            KeyEvent.KEYCODE_VOLUME_UP -> {
                val endpoint = "mobileSendNextSlideAction"
                if (motionFlag == false) {
                    startSensing()
                } else {
                    endSensing(endpoint)
                }
            }
            KeyEvent.KEYCODE_VOLUME_DOWN -> {
                val endpoint = "mobileSendPrevSlideAction"
                if (motionFlag == false) {
                    startSensing()
                } else {
                    endSensing(endpoint)
                }
            }
        }
        return false
    }

    private fun startSensing() {
        Log.d("startSensing", "start")
        motionFlag = true
        mManager.registerListener(this, mSensor, SensorManager.SENSOR_DELAY_GAME)
    }

    private fun endSensing(endpoint: String) {
        Log.d("endSensing", "end")
        // ボタンが離されたとき
        motionFlag = false
        mManager.unregisterListener(this)
        calcAmountChange(sensorzValues)
        // 端末の振る方向の検知
        val result = calcCut(sensorxValues, sensorzValues)

        val direction: String
        when (result) {
            1 -> {
                direction = "up"
            }
            2 -> {
                direction = "down"
            }
            3 -> {
                direction = "right"
            }
            else -> {
                direction = "left"
            }
        }

        val body = JSONObject(
            """{
                |"animType":$animationType,
                |"direction":$direction
                |}""".trimMargin()
        )

        socket
            .emit(endpoint, body, Emitter.Listener {
            })
            .on("webGoToNextSlide") {
                try {
                    Log.d("batchResponse", it[0].toString())
                } catch (e: Exception) {

                }
            }

//        // センサ値の値見るためのログ
        showLog()
//        // 各軸センサの初期化
        sensorxValues = mutableListOf()
        sensoryValues = mutableListOf()
        sensorzValues = mutableListOf()
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
    }


    // 取得したセンサの平均値を出す
    private fun calcSensorValues(values: MutableList<Float>): Double {
        return values.average()
    }

    // 取得下センサの変化量
    private fun calcAmountChange(values: MutableList<Float>): MutableList<Float> {
        changeValues = mutableListOf()
        for (i in 0..values.size - 10) {
            changeValues.add(values[i + 1] - values[i])
        }
//        Log.d("changeamount", changeValues.toString())
        return changeValues
    }

    // ガチ持ち手でアクション
    private fun calcCut(xvalues: MutableList<Float>, zvalues: MutableList<Float>): Int {
        var motionId = 0

        try {
            // 横振りか縦振りかを判別
            // 横振り
            if (Math.abs(xvalues[0]) > Math.abs(zvalues[0])) {
                if (calcSensorValues(xvalues) - 7 > 0) {
                    motionId = 1
                    Log.d("sensormotion", "上に向かって振ったよ")
                } else {
                    motionId = 2
                    Log.d("sensormotion", "下に向かって振ったよ")
                }
                // 縦振り
            } else {
                if (calcSensorValues(xvalues) - 3 < 0) {
                    motionId = 3
                    Log.d("sensormotion", "右に向かって振ったよ")
                } else {
                    motionId = 4
                    Log.d("sensormotion", "左に向かって振ったよ")
                }
            }
        } catch (e: Exception) {
            Log.d("errorlog", e.toString())
        }
        return motionId
    }

    // センサ値ログ表示
    private fun showLog() {
        Log.d("xsensor", sensorxValues.toString())
        Log.d("zsensor", sensorzValues.toString())
        Log.d("averagex", calcSensorValues(sensorxValues).toString())
        Log.d("averagez", calcSensorValues(sensorzValues).toString())
        Log.d("xchange", calcAmountChange(sensorxValues).toString())
        Log.d("zchange", calcAmountChange(sensorzValues).toString())
    }

    override fun onTouchEvent(event: MotionEvent?): Boolean {
        gestureDetectorCompat.onTouchEvent(event)
        return super.onTouchEvent(event)
    }

    override fun swipeAnim(swipe: String) {
        val animoView = findViewById<ImageView>(R.id.animationView)
        when (swipe) {
            "RIGHT" -> {
                animoView.setImageResource(R.drawable.ic_blur_on_white_24dp)
//                animoView.setBackgroundColor(Color.BLACK)
                animationType = "fadeOut"
                animationText.text = "フェードアウト"
                YoYo.with(Techniques.SlideInLeft)
                    .duration(700)
                    .repeat(0)
                    .playOn(animoView)
            }
            "LEFT" -> {
                animoView.setImageResource(R.drawable.ic_cached_white_24dp)
//                animoView.setBackgroundColor(Color.RED)
                animationType = "Rotate"
                animationText.text = "回転"
                YoYo.with(Techniques.SlideInRight)
                    .duration(700)
                    .repeat(0)
                    .playOn(findViewById(R.id.animationView))
            }
            "UP" -> {
                animoView.setImageResource(R.drawable.ic_compare_arrows_white_24dp)
//                animoView.setBackgroundColor(Color.GREEN)
                animationType = "none"
                animationText.text = "なし"
                YoYo.with(Techniques.SlideInUp)
                    .duration(700)
                    .repeat(0)
                    .playOn(findViewById(R.id.animationView))
            }
            "DOWN" -> {
                animoView.setImageResource(R.drawable.ic_zoom_out_map_white_24dp)
//                animoView.setBackgroundColor(Color.YELLOW)
                animationType = "zoomOut"
                animationText.text = "ズームアウト"
                YoYo.with(Techniques.SlideInDown)
                    .duration(700)
                    .repeat(0)
                    .playOn(findViewById(R.id.animationView))
            }
            else -> {
            }
        }
    }

    override fun vib() {
        val vibrator = getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
        vibrator.vibrate(longArrayOf(0, 30), -1)
    }
}