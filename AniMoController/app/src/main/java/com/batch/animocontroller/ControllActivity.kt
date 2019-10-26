package com.batch.animocontroller

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.Bundle
import android.util.Log
import android.view.KeyEvent
import android.view.MotionEvent
import androidx.appcompat.app.AppCompatActivity
import kotlinx.android.synthetic.main.activity_main.*
import kotlin.properties.Delegates

class ControllActivity : AppCompatActivity(), SensorEventListener {
    private var mManager: SensorManager by Delegates.notNull<SensorManager>()
    private var mSensor: Sensor by Delegates.notNull<Sensor>()

    private var sensorxValues: MutableList<Float> = mutableListOf()
    private var sensoryValues: MutableList<Float> = mutableListOf()
    private var sensorzValues: MutableList<Float> = mutableListOf()
    private var changeValues: MutableList<Float> = mutableListOf()

    private var motionFlag = false
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
        setContentView(R.layout.activity_main)

        //センサーマネージャーを取得する
        mManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
        //加速度計のセンサーを取得する
        mSensor = mManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        when (keyCode) {
            KeyEvent.KEYCODE_VOLUME_UP -> {
                if (motionFlag == false) {
                    startSensing()
                } else {
                    endSensing()
                }
            }
            KeyEvent.KEYCODE_VOLUME_DOWN -> {
                if (motionFlag == false) {
                    startSensing()
                } else {
                    endSensing()
                }
            }
        }
        return false
    }

    private fun startSensing() {
        Log.d("startSensing", "start")
        motionFlag = true
        mManager.registerListener(this, mSensor, SensorManager.SENSOR_DELAY_UI)
    }

    private fun endSensing() {
        Log.d("endSensing", "end")
        // ボタンが離されたとき
        motionFlag = false
        mManager.unregisterListener(this)
        calcAmountChange(sensorzValues)
        // 端末の振る方向の検知
        val result = calcCut(sensorxValues, sensorzValues)

        // センサ値の値見るためのログ
        showLog()
        // 各軸センサの初期化
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
        for (i in 1..values.size - 4) {
            changeValues.add(values[i + 1] - values[i])
        }
        Log.d("changeamount", changeValues.toString())
        return changeValues
    }

    // ガチ持ち手でアクション
    private fun calcCut(xvalues: MutableList<Float>, zvalues: MutableList<Float>): Int {
        var motionId = 0
        // 横振りか縦振りかを判別
        // 横振り
        if (Math.abs(xvalues[1]) > Math.abs(zvalues[1])) {
            Log.d("kmd", "縦ふりモード")
            if (calcSensorValues(xvalues) > 0) {
                motionId = 1
                Log.d("sensormotion", "上に向かって振ったよ")
            } else {
                motionId = 2
                Log.d("sensormotion", "下に向かって振ったよ")
            }
            // 縦振り
        } else {
            Log.d("kmd", "横ふりモード")
            if (calcSensorValues(xvalues) > 0) {
                motionId = 3
                Log.d("sensormotion", "右に向かって振ったよ")
            } else {
                motionId = 4
                Log.d("sensormotion", "左に向かって振ったよ")
            }
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
}