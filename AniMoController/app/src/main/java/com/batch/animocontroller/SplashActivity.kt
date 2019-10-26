package com.batch.animocontroller

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.os.Handler
import androidx.appcompat.app.AppCompatActivity
import kotlinx.android.synthetic.main.activity_splash.*

class SplashActivity : AppCompatActivity() {

    private val SPLASHDELAY: Long = 0
    private var mDelayHandler: Handler? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_splash)

        val mRunnable: Runnable = Runnable {
            val intent = Intent(this, ConnectActivity::class.java)
            startActivity(intent)
            finish()
        }

        mDelayHandler = Handler()
        Handler(mainLooper).postDelayed({
            var moviePath = Uri.parse("android.resource://" + packageName + "/" + R.raw.animo_splash)
            videoView.setVideoURI(moviePath)
            videoView.setOnPreparedListener{
                videoView.start()
            }
            videoView.setOnCompletionListener {
                mDelayHandler!!.postDelayed(mRunnable, SPLASHDELAY)
            }
        }, 0)
    }
}
