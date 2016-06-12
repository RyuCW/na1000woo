package java33.intime;

import android.app.Activity;
import android.app.NotificationManager;
import android.os.Bundle;
import android.widget.TextView;

public class NotificationConfirm extends Activity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		TextView tv = new TextView(this);
		tv.setText("노티피케이션을 제거 하였습니다.");
		setContentView(tv);
		
		// notification 매니저 생성
		NotificationManager nm = 
				(NotificationManager)getSystemService(NOTIFICATION_SERVICE);
		
		// 등록된 notification 을 제거 한다.
		nm.cancel(1234);
		
	}
}
