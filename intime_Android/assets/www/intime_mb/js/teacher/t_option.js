$(document).ready(function(){
	$('#t_alramTime').change(function(){
		timeSet();
		alert('알림설정이 되었습니다');
	});
	$('#t_toggleSwitch').change(alramSet);
	$('#t_deleteBtn').live('click',function(e){
		e.stopImmediatePropagation();
		deleteAccount();
		setInterval(t_interval, 1000);
	});
	
	//스위치 on/off 상태를 보여주기 위한 메서드
	if(window.localStorage.getItem('onoff')=='on'){
		$('#t_1').val('on').html('on');
		$('#t_2').val('off').html('off');
	}else{
		$('#t_1').val('off').html('off');
		$('#t_2').val('on').html('on');
	};
	
	//미리알림 시간 설정상태를 보여주기 위한 메서드
	if(window.localStorage.getItem('t_time')=='300'){
		$('.1').remove();
	}else if(window.localStorage.getItem('t_time')=='600'){
		$('.1').remove();
		$('.5').remove();
		$('.10').after($('<option></option>').val('300').html('5분전').addClass('5'));
	}else if(window.localStorage.getItem('t_time')=='900'){
		$('.1').remove();
		$('.15').remove();
		$('.5').before($('<option></option>').val('900').html('15분전').addClass('15'));
	}else if(window.localStorage.getItem('t_time')=='1800'){
		$('.1').remove();
		$('.30').remove();
		$('.5').before($('<option></option>').val('1800').html('30분전').addClass('30'));
	}
	
	
	alramSet();
	
});


//계정삭제 인터벌
function t_interval(){
	var o_id = window.localStorage.getItem('t_id');
	
	if(o_id == null){
		location.href = '../select_main.html';
	}else{
	}
}

//localStorage에 값을 저장
function setLocalData(){
	window.localStorage.setItem('key1', 'value1');
	alert('save');

}

//localStorage에 값을 로드
function getLocalData(){
	var value1 = window.localStorage.getItem('id');
	var value2 = window.localStorage.getItem('pw');
	alert(value1+',,,'+value2);

}

//localStorage에 특정키값을 삭제
function removeLocalData(){
	window.localStorage.removeItem('key1');
	alert('delete');
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
	window.localStorage.setItem('t_time', $('#t_alramTime option:selected').val());
	
	
	if($('#t_alramTime option:selected').val()>1){
		min = window.localStorage.getItem('t_time');
		t_id = window.localStorage.getItem('t_id');
		if(t_id!=null){
		$.ajax(AppContext.rootPath + '/t_noti.do',{
			type : 'POST',
			dataType : 'json',
			data : {
				t_email : t_id
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
	if($('#t_toggleSwitch option:selected').val()=='on'){
		//on을 했을경우 로컬저장소에 on값저장
		window.localStorage.setItem('onoff','on');
		
		
		$('#t_optionContent .ui-select > div').removeClass('ui-disabled');
		$('#t_optionContent .ui-select > div').attr("aria-disabled","false");
		$('#t_alramTime').removeAttr("disabled");
		$('#t_alramTime').removeClass('mobile-selectmenu-disabled ui-state-disabled');
		$('#t_alramTime').attr('aria-disabled','false');
	}else{
		//저장된 시간의 로컬저장값을 삭제
		window.localStorage.removeItem('t_time');
		
		//off했을경우 로컬저장소에 off값 저장
		window.localStorage.setItem('onoff','off');
		
		$('#t_optionContent .ui-select > div').addClass('ui-disabled');
		$('#t_optionContent .ui-select > div').attr("aria-disabled","true");
		$('#t_optionContent .ui-select > div').removeClass('ui-focus');
		$('#t_alramTime').attr("disabled","true");
		$('#t_alramTime').addClass('mobile-selectmenu-disabled ui-state-disabled');
		$('#t_alramTime').attr('aria-disabled','true');
	}
	timeSet();
}

//계정탈퇴 메서드
function deleteAccount(){
	//localStorage에 존재하는 데이터를 전부삭제
	window.localStorage.clear();
	//강사에게 해당되는 강좌목록이 있는지 확인하는 컨트롤
	$.ajax(AppContext.rootPath + '/auth/existDelete.do',{
		type : 'POST',
		dataType : 'json',
		success : function(data){
			//강좌내역이 없을시 계정삭제
			if(data.t_lecture == ''){
				//강사이메일의 FK가 없을 경우 계정을 삭제하는 컨트롤
				$.ajax(AppContext.rootPath + '/auth/emptyLectureDel.do',{
					type : 'POST',
					dataType : 'json',
					success : function(data){
						alert('계정이 삭제 되었습니다. bye');
					},
					error : function(xhr, status, message){
						alert(message);
					}
				});
			}else {//강좌내역이 있을시 차례대로 연관된 테이블내용 삭제후 계정삭제
				$.each(data.t_lecture, function(key, value){
					//강사의 이메일이 FK로 걸려있는 테이블을 차례로 삭제하는 컨트롤
					$.ajax(AppContext.rootPath + '/auth/deleteAccount.do',{
						type:'POST',
						dataType : 'json',
						data : {
							l_no : value.l_no
						},
						success: function(data){
							alert('계정이 삭제 되었습니다. bye');
						},
						error : function(xhr, status, message){
						}
					});
					
				});
			}
			
		},
		error : function(xhr, status, message){
			alert(message);
		}
	});
	
}