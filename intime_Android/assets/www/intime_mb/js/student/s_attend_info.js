$(document).ready(function() {
		subject();
		var t_date = new Date();
		Mon = eval(t_date.getMonth() + 1);
		Dat = t_date.getDate();
		
		//조건문을 걸어 10이하의 숫자를 바을때는 숫자앞에 0을 붙이도록 설정
		//삼항식을 썻다
		//조건? true : false
		Mon = (Mon < 10)? "0"+Mon : Mon;
		Dat = (Dat < 10)? "0"+Dat : Dat; 
		var t_datenow = t_date.getFullYear() + "-"
				+ Mon + "-" + Dat;
		
		$('#datepicker').attr('value', t_datenow);
	
		//subject 스크롤 박스이벤트가 바뀔때마다 이벤트 발생해줌
		$('.subject').live('change',function(e){
			e.stopImmediatePropagation();
			remove_list();
			inform();
		});
		
		
		//달력이 켜지고 꺼질때마다 이벤트 발생시켜줌
		$('#datepicker').change(function(e){
			e.stopImmediatePropagation();
			remove_list();
			inform();
		});
		
		//전체보기를 눌렀을때 이벤트 발생
		$('#ui-datepicker-div').die();
		$('#ui-datepicker-div').live('click', function(e) {
			e.stopImmediatePropagation();
			$('#datepicker').attr('value', '전체보기');
			remove_list();
			inform();
		});

		
		s_swipe();
});


function s_swipe(){

	$('#purple').swiperight(function(){
		//달력 전체보기 누를시에는 swipe 되지않게하는 조건
		if($('#datepicker').attr('value')!='전체보기'){
		var temp = $('#datepicker').attr('value');
		var temp1 = temp.split('-');
		//지정된 날짜에서 하루를 뺀다
		
		if(temp1[1]=='06' && temp1[2]=='01'||temp1[1]=='02' && temp1[2]=='01'||temp1[1]=='04' && temp1[2]=='01'||temp1[1]=='09' && temp1[2]=='01'||temp1[1]=='11' && temp1[2]=='01'){
			temp1[1]=eval(parseFloat(temp1[1])-1);
			temp1[1]=temp1[1]<10 ? '0'+temp1[1] : temp1[1];
			temp1[2]='31';
			temp3 = temp1[0] + '-' + temp1[1] +'-'+ temp1[2];
			$('#datepicker').attr('value', temp3);
		}else if(temp1[1]=='05' && temp1[2]=='01'||temp1[1]=='07' && temp1[2]=='01'||temp1[1]=='08' && temp1[2]=='01'||temp1[1]=='10' && temp1[2]=='01'||temp1[1]=='12' && temp1[2]=='01'){
			temp1[1]=eval(parseFloat(temp1[1])-1);
			temp1[1]=temp1[1]<10 ? '0'+temp1[1] : temp1[1];
			temp1[2]='30';
			temp3 = temp1[0] + '-' + temp1[1] +'-'+ temp1[2];
			$('#datepicker').attr('value', temp3);
		}else if(temp1[1]=='03'&& temp1[2]=='01'){
			temp1[1]=eval(parseFloat(temp1[1])-1);
			temp1[1]=temp1[1]<10 ? '0'+temp1[1] : temp1[1];
			temp1[2]='28';
			temp3 = temp1[0] + '-' + temp1[1] +'-'+ temp1[2];
			$('#datepicker').attr('value', temp3);
		}else if(temp1[1]=='01' && temp1[2]=='01'){
			temp1[0]=eval(parseFloat(temp1[0])-1);
			temp1[1]='12';
			temp1[2]='31';
			temp3 = temp1[0] + '-' + temp1[1] +'-'+ temp1[2];
			$('#datepicker').attr('value', temp3);
		}
		else{
		var temp2 = eval(parseFloat(temp1[2])-1);
		temp2 = temp2 < 10 ? '0'+temp2 : temp2;
		var temp3 = temp1[0] + '-' + temp1[1] +'-'+ temp2;
		$('#datepicker').attr('value', temp3);
		}
		
		
		remove_list();
		inform();
		}
		});
	
	$('#purple').swipeleft(function(){
		//달력 전체보기 누를시에는 swipe 되지않게하는 조건
		if($('#datepicker').attr('value')!='전체보기'){
		var temp = $('#datepicker').attr('value');
		var temp1 = temp.split('-');
		//지정된 날짜에서 하루를 더한다
		
		
		if(temp1[1]=='05'&& temp1[2]=='31'||temp1[1]=='01'&& temp1[2]=='31'||temp1[1]=='03'&& temp1[2]=='31'||temp1[1]=='07'&& temp1[2]=='31'||temp1[1]=='08'&& temp1[2]=='31'|| temp1[1]=='10'&& temp1[2]=='31'){
			temp1[1]=eval(parseFloat(temp1[1])+1);
			temp1[1]=temp1[1]<10 ? '0'+temp1[1] : temp1[1];
			temp1[2]='01';
			temp3 = temp1[0] + '-' + temp1[1] +'-'+ temp1[2];
			$('#datepicker').attr('value', temp3);
		}else if(temp1[1]=='04'&& temp1[2]=='30'||temp1[1]=='06'&& temp1[2]=='30'||temp1[1]=='09'&& temp1[2]=='30'||temp1[1]=='11'&& temp1[2]=='30'){
			temp1[1]=eval(parseFloat(temp1[1])+1);
			temp1[1]=temp1[1]<10 ? '0'+temp1[1] : temp1[1];
			temp1[2]='01';
			temp3 = temp1[0] + '-' + temp1[1] +'-'+ temp1[2];
			$('#datepicker').attr('value', temp3);
		}else if(temp1[1]=='02'&&temp1[2]=='28'){
			temp1[1]=eval(parseFloat(temp1[1])+1);
			temp1[1]=temp1[1]<10 ? '0'+temp1[1] : temp1[1];
			temp1[2]='01';
			temp3 = temp1[0] + '-' + temp1[1] +'-'+ temp1[2];
			$('#datepicker').attr('value', temp3);
		}else if(temp1[1]=='12'&&temp1[2]=='31'){
			temp1[0]=eval(parseFloat(temp1[0])+1);
			temp1[1]='01';
			temp1[2]='01';
			temp3 = temp1[0] + '-' + temp1[1] +'-'+ temp1[2];
			$('#datepicker').attr('value', temp3);
		}		
		else{
		var temp2 = eval(parseFloat(temp1[2])+1);
		temp2 = temp2<10 ? '0'+temp2 : temp2;
		var temp3 = temp1[0] + '-' + temp1[1] +'-'+ temp2;
		$('#datepicker').attr('value', temp3);
		}
		
		
		remove_list();
		inform();
		}
		});
}


function subject() {
	$.ajax(AppContext.rootPath+'/s_getSubject.do', {
		type : 'GET',
		dataType : 'json',
		success : function(data) {
			$.each(data.subjects, function(key, value) {
				$('#select-choice-custom').append(
						"<option class='subject'>"+value.l_name+"</option>");
			});
		},
		error : function(xhr, status, message) {
			alert(message);
		}
	});
};

function inform() {

	var subjectName = $('.subject').html();
	var date = $('#datepicker').attr('value');
	var subjectNum = 0;
	
	
	//결석자동처리 메서드
	$.ajax(AppContext.rootPath+'/auth/s_todayLecture.do',{
		type : 'GET',
		dataType : 'json',
		success : function(data){
			if(data.today_lec.length != 0){
				$.each(data.today_lec, function(key, value){
					l_no=value.l_no;
					l_e_time = parseFloat(value.l_e_time);
					l_now = value.l_now;
					$.ajax(AppContext.rootPath + '/auth/s_exist1.do',{
						type : 'POST',
						dataType : 'json',
						data : {
							l_no : value.l_no
						},
						success : function(data){
							if(data.exist1.a_status == '-'){
								if(l_e_time+600<l_now){
									$.ajax(AppContext.rootPath+'/auth/s_exist2.do',{
										type : 'POST',
										dataType : 'json',
										data : {
											a_no : data.exist1.a_no,
											a_stat : '결석',
											a_tag_stat : 2
											
										},
										success : function(data){
//											alert('결석처리완료');
										},
										error : function(xhr, status, message){
											alert(message);
										}
									});
//									alert('결석처리중');
								}
								
							}else{
//								alert('입실하였거나 시작하지않은 수업입니다.');
							}
						},
						error : function(xhr, status, message){
							alert(message);
						}
					});
				});
			}else{
//				alert('오늘 수업 없음');
			}
		},
		error : function(xhr, status, message){
			alert(message);
		}
	});
	
	
	if($('span.subject').html() == '--전체보기--' && $('#datepicker').attr('value') == '전체보기'){
		$.ajax(AppContext.rootPath+'/s_getAttendAll.do',{
			type: 'post',
			dataType:'json',
			success: function(data){
				if(data.attend.length!=0){
					$('.existAt').remove();
					append(data);
				}else{
					$('.existAt').remove();
					$('#lecture-list-div').append($('<p></p>').addClass('existAt').html('해당 정보가 없습니다!'));
				}
			}
		});
	}else if ($('span.subject').html() == '--전체보기--') {
		$.ajax(AppContext.rootPath+'/s_getAttendSubAll.do',{
			type: 'post',
			dataType:'json',
			data: {
				a_day : date
			},
			success: function(data){
				if(data.attend.length!=0){
					$('.existAt').remove();
					append(data);
				}else{
					$('.existAt').remove();
					$('#lecture-list-div').append($('<p></p>').addClass('existAt').html('해당 정보가 없습니다!'));
				}
			}
		});
	}else if ($('#datepicker').attr('value') == '전체보기') {
		$.ajax(AppContext.rootPath+'/s_getSubjectNo.do',{
			type:'post',
			dataType:'json',
			data: {
				l_name:subjectName
			},
			success: function(data){
				subjectNum = data.lectureNo.l_no;
			}
		});
		
		$.ajax(AppContext.rootPath+'/s_getAttendDateAll.do',{
			type: 'post',
			dataType:'json',
			data: {
				l_no : subjectNum
			},
			success: function(data){
				if(data.attend.length!=0){
					$('.existAt').remove();
					append(data);
				}else{
					$('.existAt').remove();
					$('#lecture-list-div').append($('<p></p>').addClass('existAt').html('해당 정보가 없습니다!'));
				}
			}
		});
	}else{
		$.ajax(AppContext.rootPath+'/s_getSubjectNo.do',{
			type:'post',
			dataType:'json',
			data: {
				l_name:subjectName
			},
			success: function(data){
				if(data.lectureNo!=null){
					$.ajax(AppContext.rootPath+'/s_getAttendStatus.do',{
						type: 'post',
						dataType:'json',
						data: {
							l_no : data.lectureNo.l_no,
							a_day : date
						},
						success: function(data){
							if(data.attend.length!=0){
								$('.existAt').remove();
								append(data);
							}else{
								$('.existAt').remove();
								$('#lecture-list-div').append($('<p></p>').addClass('existAt').html('해당 정보가 없습니다!'));
							}
						}
					});	
					
				}
			}
		});
		
		
	}
};

function append(data){
	$('#lecture-list-div').append(
			$('<div></div>').addClass("lecture-list-title")
					.append(
							$('<div></div>').attr('id',
									'lecture-list-titleName').html(
									'수업명'))
					.append(
							$('<div></div>').attr('id',
									'lecture-list-titleDate').html(
									'날짜'))
					.append(
							$('<div></div>').attr('id',
									'lecture-list-titleAttend')
									.html('출결사항'))
					.append(
							$('<div></div>').attr('id',
									'table-line')));
	for(var i in data.attend){
	
		$('#lecture-list-div').append(
			$('<div></div>').addClass("lecture-list-line")
			.append($('<div></div>').addClass('lecture-list-name').html("<a>" + data.attend[i].a_l_name + "</a>"))
			.append($('<div></div>').addClass('lecture-list-date').html("<a>" + data.attend[i].a_day + "</a>"))
			.append($('<div></div>').addClass('lecture-list-attend').html("<a>" + data.attend[i].a_status + "</a>"))
			.append($('<div></div>').attr('id','table-line')));
	}
}

function remove_list() {
	$('.lecture-list-title').empty();
	$('.lecture-list-title').remove();
	$('.lecture-list-line').empty();
	$('.lecture-list-line').remove();
};

