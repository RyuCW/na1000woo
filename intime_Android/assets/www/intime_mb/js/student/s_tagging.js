$(document).ready(function(){
	tagInterval = setInterval(lectureRegByNfc, 2000);
	$('.purple').click(function(){
		clearInterval(tagInterval);
	});
	$('.yellow').click(function(){
		clearInterval(tagInterval);
	});
	$('.green').click(function(){
		clearInterval(tagInterval);
	});
	$('.red_press').click(function(){
		clearInterval(tagInterval);
	});
	
});
function lectureRegByNfc(){
	var nfcNum = $('.nfcNum2').html();
//	alert(nfcNum);
	
	var today = new Date();
	var day = today.getDay();
	
	switch(day){
	case 1:
		day = '월';
		break;
	case 2:
		day = '화';
		break;
	case 3:
		day = '수';
		break;
	case 4:
		day = '목';
		break;
	case 5:
		day = '금';
		break;
	case 6:
		day = '토';
		break;
	case 0:
		day = '일';
		break;
	}
		
	if(nfcNum != ''){
		$.ajax(AppContext.rootPath+'/auth/s_getLectureByNfc.do',{
			type:'post',
			dataType:'json',
			data:{
				nfcNum:nfcNum,
				l_date:day				
			},
			success:function(data){
//				alert('success');
				clearInterval(tagInterval);
				if(data.lecture.length>0){
				if(data.status == 'success'){
					for(var i in data.lecture){
						var startTimeArr = data.lecture[i].l_s_time.split(":");
						var endTimeArr = data.lecture[i].l_e_time.split(":");
						
						var startStr = startTimeArr[0]+startTimeArr[1];
						var endStr = endTimeArr[0]+endTimeArr[1];
						
						startTime = parseInt(startStr, 10);
						endTime = parseInt(endStr, 10);
						
						var minutes = today.getMinutes();
						
						if(minutes < 10){
							minutes = "0"+minutes.toString();
						}
						
						currentTime = parseInt(today.getHours().toString()+minutes,10); 
						
						
						if(currentTime>startTime && currentTime<endTime){
							var lectureNum = data.lecture[i].l_no;
							if(data.lecture[i].s_reg_onoff == 'on'){
								$.ajax(AppContext.rootPath+'/auth/s_regAttendByNfc.do',{
									type:'post',
									dataType:'json',
									data:{
										l_no : lectureNum
									},
									success:function(data){
										if(data.status == 'success'){
											alert('수업 등록 성공');
											
											$.ajax(AppContext.rootPath+'/auth/s_firstRegAttend.do',{
												type:'post',
												dataType:'json',
												data:{
													l_no : lectureNum
												},
												success:function(){
													alert('첫 번째 출석 등록 성공');
													$.mobile.defaultPageTransition = "none";
													$.mobile.changePage('s_lecture_info.html');
												},
												error:function(xhr, status, message){
													window.alert(message);
												}
											});
											
										}else{
											alert('이미 등록되어 있습니다');
											$.mobile.defaultPageTransition = "none";
											$.mobile.changePage('s_lecture_info.html');
										}
									},
									error:function(xhr, status, message){
										window.alert(message);
									}
								});
							}else{
								alert('등록 on되지 않았습니다');
								$.mobile.defaultPageTransition = "none";
								$.mobile.changePage('s_lecture_info.html');
							}
						}else{
							$.mobile.defaultPageTransition = "none";
							$.mobile.changePage('s_lecture_info.html');
						}
					}
				}else{
					alert("해당 수업을 찾을 수 없습니다");
					clearInterval(tagInterval);
					$.mobile.defaultPageTransition = "none";
					$.mobile.changePage('s_lecture_info.html');
				}
			}else{
				alert("해당 수업을 찾을 수 없습니다");
				clearInterval(tagInterval);
				$.mobile.defaultPageTransition = "none";
				$.mobile.changePage('s_lecture_info.html');
			}
			},
			error:function(xhr, status, message){
				window.alert(message);
			}
		});
	}
}