$(document).ready(function(){
	$('#s_alramTime').change(function(){
		timeSet();
		alert('알림설정이 되었습니다');
	});
	$('#s_toggleSwitch').change(alramSet);
	$('#s_deleteBtn').live('click', function(e){
		e.stopImmediatePropagation();
		s_deleteAccount();
		setInterval(s_interval, 1000);
	});
	
	//스위치 on/off 상태를 보여주기 위한 메서드
	if(window.localStorage.getItem('onoff')=='on'){
		$('#s_1').val('on').html('on');
		$('#s_2').val('off').html('off');
	}else{
		$('#s_1').val('off').html('off');
		$('#s_2').val('on').html('on');
	};
	
	//미리알림 시간 설정상태를 보여주기 위한 메서드
	if(window.localStorage.getItem('s_time')=='300'){
		$('.1').remove();
	}else if(window.localStorage.getItem('s_time')=='600'){
		$('.1').remove();
		$('.5').remove();
		$('.10').after($('<option></option>').val('300').html('5분전').addClass('5'));
	}else if(window.localStorage.getItem('s_time')=='900'){
		$('.1').remove();
		$('.15').remove();
		$('.5').before($('<option></option>').val('900').html('15분전').addClass('15'));
	}else if(window.localStorage.getItem('s_time')=='1800'){
		$('.1').remove();
		$('.30').remove();
		$('.5').before($('<option></option>').val('1800').html('30분전').addClass('30'));
	}
	
	
	alramSet();
	
	
	
});

//계정삭제 인터벌
function s_interval(){
	var o_id = window.localStorage.getItem('s_id');
	
	if(o_id == null){
		location.href = '../select_main.html';
	}else{
	}
	
}
//학생 계정삭제 메서드
function s_deleteAccount(){
	//localStorage에 저장된 모든 키값을 삭제
	window.localStorage.clear();
	//학생이메일 FK로 설정된 테이블데이터정보와 계정삭제 컨트롤
	$.ajax(AppContext.rootPath + '/auth/s_deleteAccount.do',{
	type:'POST',
	dataType : 'json',
	success: function(data){
		
		alert('계정이 삭제 되었습니다. bye');
	},
	error : function(xhr, status, message){
		alert(message);
	}
});
}


//localStorage에 값을 전부 삭제
function clearLocalData(){
	window.localStorage.clear();
	alert('로그아웃되었습니다.');
}
$('.logout').click(function(){
	clearLocalData();
	location.href = '../select_main.html';
});

function timeSet(){
	//선택한 시간값을 로컬저장소에 저장
	window.localStorage.setItem('s_time', $('#s_alramTime option:selected').val());
	
	//선택한 val값이 1보다크면
	if($('#s_alramTime option:selected').val()>1){
	min = window.localStorage.getItem('s_time');
	s_id = window.localStorage.getItem('s_id');
	if(s_id!=null){
	$.ajax(AppContext.rootPath + '/noti.do',{
		type : 'POST',
		dataType : 'json',
		data : {
			s_email : s_id
		},
		success : function(data){
			//네이티브로 값전달
			obj=JSON.stringify(data);
			window.intime.setMessage(obj, min);
		},
		error : function(xhr, status, message){
			alert('error'+message);
		}
	
	});
	}
}
	
}


function alramSet(){
	if($('#s_toggleSwitch option:selected').val()=='on'){
		
		//on을 했을경우 로컬저장소에 on값저장
		window.localStorage.setItem('onoff','on');
		
		$('#s_optionContent .ui-select > div').removeClass('ui-disabled');
		$('#s_optionContent .ui-select > div').attr("aria-disabled","false");
		$('#s_alramTime').removeAttr("disabled");
		$('#s_alramTime').removeClass('mobile-selectmenu-disabled ui-state-disabled');
		$('#s_alramTime').attr('aria-disabled','false');
		
	}else{
		//저장된 시간의 로컬저장값을 삭제
		window.localStorage.removeItem('s_time');
		
		//off했을경우 로컬저장소에 off값 저장
		window.localStorage.setItem('onoff','off');
		$('#s_optionContent .ui-select > div').addClass('ui-disabled');
		$('#s_optionContent .ui-select > div').attr("aria-disabled","true");
		$('#s_optionContent .ui-select > div').removeClass('ui-focus');
		$('#s_alramTime').attr("disabled","true");
		$('#s_alramTime').addClass('mobile-selectmenu-disabled ui-state-disabled');
		$('#s_alramTime').attr('aria-disabled','true');
	}
	timeSet();
} 


