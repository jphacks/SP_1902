package com.batch.animocontroller

import android.content.Intent
import android.nfc.Tag
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Toast
import io.socket.client.IO
import io.socket.emitter.Emitter
import kotlinx.android.synthetic.main.activity_connect.*
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import org.json.JSONObject
import kotlin.concurrent.thread
import kotlin.coroutines.experimental.migration.toExperimentalCoroutineContext

class ConnectActivity : AppCompatActivity() {

    private val socket = IO.socket("http://ec2-54-65-64-81.ap-northeast-1.compute.amazonaws.com")
    var connectionFlag = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_connect)

        startButton.visibility = View.GONE

        connectButton.setOnClickListener {
            Log.d("batchkakeru", "1")
                GlobalScope.launch {
//                    Toast.makeText(it.context, "接続しています", Toast.LENGTH_SHORT).show()
                    connection()
                }
                Thread.sleep(1100)
            Log.d("batchkakeru", "3")
            if (connectionFlag == true) {
                startButton.visibility = View.VISIBLE
//                Toast.makeText(this, "接続しました", Toast.LENGTH_SHORT).show()
            }
        }

        startButton.setOnClickListener {
            val intent = Intent(this, ControllActivity::class.java)
            startActivity(intent)
        }
    }

    private fun connection() {
        val TAG = "batchSocketIO"
        socket.connect()
            .on(io.socket.client.Socket.EVENT_CONNECT) {
                Log.d(TAG, "CONNECT!")
            }
            .emit("onreq", "", Emitter.Listener {
                it[0]
            })
            .on("ping") {
                try {
                    val json = it[0] as JSONObject
                    Log.d("batchkakeru", "2")
                    connectionFlag = true
                } catch (e: Exception) {
                    Log.d(TAG, e.toString())
                }
            }
            .on(io.socket.client.Socket.EVENT_DISCONNECT) {
                Log.d(TAG, "DISCONNECT!")
            }
    }
}
