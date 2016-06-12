package java33.intime;

import java.util.Calendar;
import java33.intime.intime.AndroidBridge;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.R;
import android.annotation.SuppressLint;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.IBinder;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

@SuppressLint("SetJavaScriptEnabled")
public class AlarmService_Service extends Service {

	// 노티피케이션 매니저 객체생성
	private NotificationManager noti = null;
	WebView webView;
	AndroidBridge temp;
	@JavascriptInterface
	@Override
	public IBinder onBind(Intent intent) {
		// TODO Auto-generated method stub
		return null;
	}
	@JavascriptInterface
	@Override
	public void onStart(Intent intent, int startId) {
		// TODO Auto-generated method stub
		Log.e("noti", "*");
		// 현재시간을 초로 계산
		final Calendar c = Calendar.getInstance();
		int mHour = c.get(Calendar.HOUR_OF_DAY);
		int mMinute = c.get(Calendar.MINUTE);
		int mSecond = c.get(Calendar.SECOND);
		int sHour = mHour * 60 * 60;
		int sMinute = mMinute * 60;
		int total = sHour + sMinute + mSecond;

		// 로컬저장소 값을 호출
		SharedPreferences pref = getSharedPreferences("pref", MODE_PRIVATE);
		String result = pref.getString("time", "");
		String result2 = pref.getString("min", "0");

		// 값비교를 위해 int형으로 parsing
		int prev_time = Integer.parseInt(result2);
		// 분으로 다시 치환
		int noti_time = prev_time / 60;

		try {
			// 받아온 제이슨 스트링 배열을 호출
			JSONObject a = new JSONObject(result);
			JSONArray b = a.getJSONArray("noti_time");
			for (int i = 0; i < b.length(); i++) {
				JSONObject d = b.getJSONObject(i);

				// 과목명
				String subject_name = d.getString("l_name");
				// 과목의 시작시간
				int subject = Integer.parseInt(d.getString("l_s_time"));
				Log.e("noti", Integer.toString(total) + " : " + Integer.toString(prev_time) + " : " + Integer.toString(subject));
				// 현재시간+설정시간=시작시간
				if (total + prev_time == subject) {
					PendingIntent pendi = PendingIntent.getService(
							AlarmService_Service.this, 0, new Intent(
									AlarmService_Service.this,
									NotificationConfirm.class), 0);
					Log.e("noti", "8");
					Log.e("noti", subject_name);
					// 노티피케이션매니저 객체에 서비스객체를 준다
					noti = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);

					// 노티피케이션 객체생성(제목창)
					Notification nt = new Notification(java33.intime.R.drawable.logo2,
							subject_name + "수업 " + noti_time + "분전입니다!",
							System.currentTimeMillis());
					// 내용
					nt.setLatestEventInfo(AlarmService_Service.this, "inTime",
							subject_name + "수업 " + noti_time + "분전입니다!", pendi);

					nt.flags = nt.flags | nt.FLAG_AUTO_CANCEL;
					noti.notify(1234, nt);
					Log.e("noti", "9");
					// Toast.makeText(AlarmService_Service.this,
					// "현재 시간"+mHour+":"+mMinute+":"+mSecond+"test--"+total,
					// Toast.LENGTH_SHORT).show();
				}

			}
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		super.onStart(intent, startId);

	}

}
