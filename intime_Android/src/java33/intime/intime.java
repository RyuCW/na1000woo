/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package java33.intime;

import org.apache.cordova.CordovaWebView;
import org.apache.cordova.DroidGap;

import android.annotation.SuppressLint;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Handler;
import android.os.SystemClock;
import android.util.Log;
import android.webkit.JavascriptInterface;

@SuppressLint("SetJavaScriptEnabled")
public class intime extends DroidGap {

	CordovaWebView webView = appView;
	private final Handler handler = new Handler();
	@JavascriptInterface
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		super.init();
		super.loadUrl("file:///android_asset/www/intime_mb/main.html");

		// 자바스크립트 허용
		appView.getSettings().setJavaScriptEnabled(true);
		appView.addJavascriptInterface(new AndroidBridge(), "intime");

		Log.e("noti","1");
		// 서비스로 인텐트 값을 넘겨준다
		Intent intent = new Intent(intime.this, AlarmService_Service.class);
		PendingIntent sender = PendingIntent.getService(intime.this, 0, intent,
				0);
		Log.e("noti","2");
		long firstTime = SystemClock.elapsedRealtime();
		firstTime += 1 * 1000;
		// Alarm을 설정. 1초마다 어떤 일을 반복
		AlarmManager am = (AlarmManager) getSystemService(ALARM_SERVICE);
		am.setRepeating(AlarmManager.ELAPSED_REALTIME_WAKEUP, firstTime,
				1 * 1000, sender);
		startService(new Intent("java33.intime"));
		Log.e("noti","3");
	}
	
	public class AndroidBridge {
		@JavascriptInterface
		public void setMessage(final String arg, final String min) { // must be
			Log.e("noti","6");										// final
			handler.post(new Runnable() {
				public void run() {
					Log.d("HybridApp", "setMessage(" + arg + ")");
					Log.e("noti","4");
					Log.e("noti","setMessage(" + arg + ")");
					// 로컬저장소에 받아온 값을 저장
					SharedPreferences pref = getSharedPreferences("pref",
							MODE_PRIVATE);
					SharedPreferences.Editor editor = pref.edit();
					editor.putString("time", arg);
					editor.putString("min", min);

					editor.commit();
					Log.e("noti","5");

				}
			});
		}
	}

}
