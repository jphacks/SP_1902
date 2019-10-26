package com.batch.animocontroller

import android.util.Log
import android.view.GestureDetector
import android.view.MotionEvent

class AniMoSwipe : GestureDetector.SimpleOnGestureListener() {
    private val MIN_SWIPE_DISTANCE_X = 100
    private val MIN_SWIPE_DISTANCE_Y = 100
    private val MAX_SWIPE_DISTANCE_X = 1000
    private val MAX_SWIPE_DISTANCE_Y = 1000

    override fun onFling(
        e1: MotionEvent?,
        e2: MotionEvent?,
        velocityX: Float,
        velocityY: Float
    ): Boolean {


        val deltaX: Float
        val deltaY: Float
        if (e1?.x != null && e2?.x != null && e1?.y != null && e2?.y != null) {
            deltaX = e1.x - e2.x
            deltaY = e1.y - e2.y
        } else {
            deltaX = 0.0f
            deltaY = 0.0f
        }
        val deltaXAbs = Math.abs(deltaX)
        val deltaYAbs = Math.abs(deltaY)
        Log.d("batchSwipe", "aaa")

        if ((deltaXAbs >= MIN_SWIPE_DISTANCE_X) && (deltaXAbs <= MAX_SWIPE_DISTANCE_X)) {
            if (deltaX > 0) {
                Log.d("batchSwipe", "Swipe to left")
            } else {
                Log.d("batchSwipe", "Swipe to right")
            }
        }
        if ((deltaYAbs >= MIN_SWIPE_DISTANCE_Y) && (deltaYAbs <= MAX_SWIPE_DISTANCE_Y)) {
            if (deltaY > 0) {
                Log.d("batchSwipe", "Swipe to up")
            } else {
                Log.d("batchSwipe", "Swipe to down")
            }
        }
        return true
    }
}