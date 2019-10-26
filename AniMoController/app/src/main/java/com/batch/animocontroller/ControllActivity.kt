package com.batch.animocontroller

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.Bundle
import android.util.Log
import android.view.MotionEvent
import androidx.appcompat.app.AppCompatActivity
import kotlinx.android.synthetic.main.activity_main.*
import kotlin.properties.Delegates

class ControllActivity : AppCompatActivity() , SensorEventListener {
    private var mManager: SensorManager by Delegates.notNull<SensorManager>()
    private var mSensor: Sensor by Delegates.notNull<Sensor>()

    private var sensorxValues: MutableList<Float> = mutableListOf()
    private var sensoryValues: MutableList<Float> = mutableListOf()
    private var sensorzValues: MutableList<Float> = mutableListOf()
    private var changeValues: MutableList<Float> = mutableListOf()

    override fun onSensorChanged(event: SensorEvent) {
        var strb: StringBuffer = StringBuffer()

        if (event.sensor.type == Sensor.TYPE_ACCELEROMETER) {
            strb.append("x軸")
            strb.append(event.values[0])
            strb.append("　y軸")
            strb.append(event.values[1])
            strb.append("　z軸")
            strb.append(event.values[2])
            accelText.setText(strb.toString())

            // 各軸のセンサを配列に入れる
            sensorxValues.add(event.values[0])
            sensoryValues.add(event.values[1])
            sensorzValues.add(event.values[2])

            // 加速度から重力の方向を表示
            if (event.values[0] >= 9) gravityText.setText("←")
            if (event.values[0] <= -9) gravityText.setText("→")
            if (event.values[1] >= 9) gravityText.setText("↓")
            if (event.values[1] <= -9) gravityText.setText("↑")
            if (event.values[2] >= 9) gravityText.setText("下")
            if (event.values[2] <= -9) gravityText.setText("上")
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        //センサーマネージャーを取得する
        mManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
        //加速度計のセンサーを取得する
        mSensor = mManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)


        action1Button.setOnTouchListener { _, event ->
            when (event.action) {
                MotionEvent.ACTION_DOWN -> {
                    // ボタンが押し込まれたとき
                    mManager.registerListener(this, mSensor, SensorManager.SENSOR_DELAY_UI)
                    labelsText.setText("押しているよ")
                }
                MotionEvent.ACTION_UP -> {
                    // ボタンが離されたとき
                    mManager.unregisterListener(this)
                    labelsText.setText("離したよ")
                    gravityText.setText("重力リセット")
                    Log.d("xsensor", sensorxValues.toString())
                    Log.d("zsensor", sensorzValues.toString())
                    Log.d("averagex", calcSensorValues(sensorxValues).toString())
                    Log.d("averagez", calcSensorValues(sensorzValues).toString())
                    Log.d("xchange", calcAmountChange(sensorxValues).toString())
                    Log.d("zchange", calcAmountChange(sensorzValues).toString())

                    calcCut(sensorxValues, sensorzValues)
                    calcAmountChange(sensorzValues)

                    // 各軸センサの初期化
                    sensorxValues = mutableListOf()
                    sensoryValues = mutableListOf()
                    sensorzValues = mutableListOf()
                }
            }
            false
        }
        action2Button.setOnTouchListener { _, event ->
            when (event.action) {
                MotionEvent.ACTION_DOWN -> {
                    // ボタンが押し込まれたとき
                    mManager.registerListener(this, mSensor, SensorManager.SENSOR_DELAY_UI)
                    labelsText.setText("押しているよ")
                }
                MotionEvent.ACTION_UP -> {
                    // ボタンが離されたとき
                    mManager.unregisterListener(this)
                    labelsText.setText("離したよ")
                    gravityText.setText("重力リセット")
                    sensorxValues = mutableListOf()
                    sensoryValues = mutableListOf()
                    sensorzValues = mutableListOf()
                }
            }
            false
        }
        action3Button.setOnTouchListener { _, event ->
            when (event.action) {
                MotionEvent.ACTION_DOWN -> {
                    // ボタンが押し込まれたとき
                    mManager.registerListener(this, mSensor, SensorManager.SENSOR_DELAY_UI)
                    labelsText.setText("押しているよ")
                }
                MotionEvent.ACTION_UP -> {
                    // ボタンが離されたとき
                    mManager.unregisterListener(this)
                    labelsText.setText("離したよ")
                    gravityText.setText("重力リセット")
                    sensorxValues = mutableListOf()
                    sensoryValues = mutableListOf()
                    sensorzValues = mutableListOf()
                }
            }
            false
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
    }

    // 取得したセンサの平均値を出す
    fun calcSensorValues(values: MutableList<Float>): Double {
        return values.average()
    }

    // 取得下センサの変化量
    fun calcAmountChange(values: MutableList<Float>): MutableList<Float> {
        changeValues = mutableListOf()
        for (i in 1..values.size - 4) {
            changeValues.add(values[i + 1] - values[i])
        }
        Log.d("changeamount", changeValues.toString())
        return changeValues
    }

    fun calcCut(xvalues: MutableList<Float>, zvalues: MutableList<Float>): Int {
        var motionId = 0
        // 横振りか縦振りかを判別
        // 横振り
        if (Math.abs(calcSensorValues(xvalues)) > Math.abs(calcSensorValues(zvalues))) {
            if (calcSensorValues(xvalues) > 0) {
                Log.d("sensormotion", "右に向かって振ったよ")
                motionId = 1
            } else {
                Log.d("sensormotion", "左に向かって振ったよ")
                motionId = 2
            }
            // 縦振り
        } else {
            if (calcSensorValues(zvalues) > 0) {
                Log.d("sensormotion", "上に向かって振ったよ")
                motionId = 3
            } else {
                Log.d("sensormotion", "下に向かって振ったよ")
                motionId = 4
            }
        }
        return motionId
    }
}