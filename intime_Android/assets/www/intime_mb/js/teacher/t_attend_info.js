$(document).ready(
		function() {
			subject();

			// 현재 날짜를 출력해준다
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

			//-를 빼서 오늘 짜가 강좌의 수업에 해당하는 날인지 비교하기위해 씀
			t_datenow_min = parseFloat(t_date.getFullYear() + Mon + Dat);
			
			
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
			//슬라이드 효과메서드를 실행
			t_swipe();
			
		});

//손으로 슬라이드 했을때 발생하는 메서드
function t_swipe(){
	$('#purple').swiperight(function(){
		var subject = $('span.subject').html();
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
		
	});
	
	$('#purple').swipeleft(function(){
		var subject = $('span.subject').html();
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
		
	});
}


function subject() {
	// 로그인한 강사에대한 강좌리스트를 스크롤박스로 가져온다
	$.ajax(AppContext.rootPath + '/t_lecture.do', {
		type : 'GET',
		dataType : 'json',
		success : function(data) {
			$.each(data.subject, function(key, value) {
				// 받아온 데이터중 강좌이름을 스크롤박스에 추가한다.
				$('#select-choice-custom')
						.append(
								"<option class='subject'>" + value.l_name
										+ "</option>");

			});

		},
		error : function(xhr, status, message) {
			alert(message);
		}
	});
};

function inform() {

	// 스크롤 박스 안의 내용을 불러서 변수에 담는다.
	var subject = $('span.subject').html();

	// ***************** 중요한 정보 *******************//
	// 과목을 담은 변수를 인코딩을 한다
	// 이유는? ajax로 넘길때 글자가 깨지므로 인코딩을 해서 넘긴후
	// 받는 컨트롤 단에서 디코더를 다시 해줘야한다.
	var subjectEnco = encodeURIComponent(subject);
	subjectGetNo = 0;

	// 스크롤 박스 안의 과목에 대한 PK이인 과목 번호를 받아온다.
	$.ajax(AppContext.rootPath + '/t_getSubjectNo.do', {
		type : 'POST',
		dataType : 'json',
		data : {
			// 인코딩한 과목이름을 넘겨준다.
			lecture : subjectEnco
		},
		success : function(data) {
			// 받아온 데이터를 전역변수에 담는다.
			if(data.subjectNo != null){
			subjectGetNo = data.subjectNo.l_no;
			//수업 시작일과 종료일을 받아온다.
			subjectGetS_day = data.subjectNo.l_s_day;
			subjectGetE_day = data.subjectNo.l_e_day;
			}
		}
	});

	// 달력선택된 날짜를 변수에 담는다
	var pic = $('#datepicker').attr('value');
	
	//받아온 수업날짜들을 -를 없애고 실수로 parsing
	var sday_split = subjectGetS_day.split('-');
	sday_parse = parseFloat(sday_split[0]+sday_split[1]+sday_split[2]);
	
	var eday_split = subjectGetE_day.split('-');
	eday_parse = parseFloat(eday_split[0]+eday_split[1]+eday_split[2]);
	
	
	
	//오늘이 수업일수 사이일경우
	if(sday_parse<=t_datenow_min && eday_parse>=t_datenow_min){
		//선택한 과목의 오늘요일에 해당하는 수업정보를 뽑아오는 메서드
		$.ajax(AppContext.rootPath + '/auth/existLectureInStudent.do',{
			type : 'POST',
			dataType : 'json',
			data : {
				//선택한 과목명을 데이터로 넘긴다
				l_no : subjectGetNo
			},
			success : function(data){
				$.each(data.exist, function(key, value){
//						//그 수업의 학생정보를 받아왔을경우
						if(value.s_email != undefined){
								use_email = value.s_email;
								use_no = value.l_no;
								//학생의 출결정보 존재 유무를 판단하는 컨트롤
							$.ajax(AppContext.rootPath + '/auth/existStep1.do',{
								type : 'POST',
								dataType : 'json',
								data : {
									s_email : value.s_email,
									l_no : value.l_no
								},
								success : function(data){
									//데이터의 내용이 undefined일 경우
									//그 학생의 출결정보는 없으므로 수업을 듣는 학생들을 insert
									if(data.step1 == undefined){
										//강좌에 존재하는 학생이 출결테이블에 존재하지않을 경우 학생정보를 
										//출결테이블에 insert 하는 컨트롤
										$.ajax(AppContext.rootPath + '/auth/existStep3.do',{
											type : 'POST',
											dataType : 'json',
											data : {
												//강좌등록된 학생이메일,강좌번호,-,태그상태0을 데이터로 보낸다
												s_email : use_email,
												l_no : use_no,
												a_stat : '-',
												a_tag_stat : 0
											},
											success : function(data){
												//insert 성공
											},
											error : function(xhr, status, message){
												alert('처리실패');
											}
										});
									}else{//데이터가 존재할경우 출결을 완료한 상태
									}
								},
								error : function(xhr, status, message){
									alert(message);
								}
							});
							}
							else{//수업에 학생이 등록되어있지않을 경우
								alert('등록된 학생이 없습니다');
							}
				});
			},
			error : function(xhr, status, message){
				alert('요청실패');
			}
		});
		
		
	}
	
	
	
	//수업이 끝났을 경우 참석하지 않은 학생들의 결석처리를 하기위한 로직
	//조회를 눌렀을 경우 조회한 강좌의 수업이 끝이났으면 참석하지 않은 학생들의
	//attend 테이블에는 결석내용이 update 된다
	$.ajax(AppContext.rootPath + '/auth/existLectureInStudent.do',{
		type : 'POST',
		dataType : 'json',
		data : {
			//선택한 과목명을 데이터로 넘긴다
			l_no : subjectGetNo
		},
		success : function(data){
			$.each(data.exist, function(key, value){
					//그 수업의 학생정보를 받아왔을경우
				if(value.l_e_time+600 < value.l_now){
					if(value.s_email != undefined){
							use_email = value.s_email;
							use_no = value.l_no;
							//학생의 출결정보 존재 유무를 판단하는 컨트롤
						$.ajax(AppContext.rootPath + '/auth/existStep1.do',{
							type : 'POST',
							dataType : 'json',
							data : {
								s_email : value.s_email,
								l_no : value.l_no
							},
							success : function(data){
								
								if(data.step1.a_status == '-'){
									$.ajax(AppContext.rootPath + '/auth/existStep2.do',{
										type : 'POST',
										dataType : 'json',
										data : {
											a_no : data.step1.a_no,
											a_status : '결석'
										},
										success : function(data){
//											alert('결석처리완료');
										},
										error : function(xhr, status, message){
											alert(message);
										}
									});
								}else{
//									alert('출결처리된 수업입니다');
								}
								
							},
							error : function(xhr, status, message){
								alert(message);
							}
						});
						}
						else{//수업에 학생이 등록되어있지않을 경우
							alert('등록된 학생이 없습니다');
						}
				}else{
//					alert('종료된 수업입니다');
				}
			});
		},
		error : function(xhr, status, message){
			alert('요청실패');
		}
	});
	
	

	// 조건에 따른 출결상태를 출력한다
	$.ajax(AppContext.rootPath + '/t_attend_info.do', {
		type : 'POST',
		datyType : 'json',
		data : {
			// 위에서 받아온 강좌번호와 날짜 변수 데이터를 넘겨준다
			l_no : subjectGetNo,
			l_day : pic
		},
		success : function(data) {
			// 조건에 맞는 데이터값을 받아와서 동적으로 출력시킨다.
			var obj = data;
			if(obj.attend.length != 0){
				$('.existAt').remove();
				$('#student-list-div').append(
						$('<div></div>').addClass("student-list-title").append(
								$('<div></div>').attr('id', 'student-list-title-attend')
										.html('출결상태')).append(
								$('<div></div>').attr('id', 'student-list-title-name')
										.html('이름')).append(
								$('<div></div>').attr('id', 'table-line')));
				
				
			
			$.each(obj.attend, function(key, value) {
				$('#student-list-div').append(
						$('<div></div>').addClass("student-list-line").append(
								$('<div></div>').addClass(
										'student-list-line-attend').html(
										"<a>" + value.a_status + "</a>"))
								.append(
										$('<div></div>').addClass(
												'student-list-line-name' + key)
												.attr('data-rel', 'popup')
												.html(
														"<a>" + value.a_name
																+ "</a>"))
								.append(
										$('<div></div>').attr('id',
												'table-line')));

				var named = value.a_name;
				$('.student-list-line-name' + key).die('click');
				$('.student-list-line-name' + key).live(
						'click',
						function() {
							$('#popupBasic').popup('open');
							$('#student-name').html(named);
							$('#attend_img').attr('src',
									AppContext.rootPicture + '/intime_server/picture/'+ value.a_picture);
							$('#pop_add').html(value.a_addr);
							$('#pop_email').html(value.a_email);
							$('#pop_ph').html(value.a_ph).attr('href',
									'tel:' + value.a_ph);
							
							
							$('#present-update').val('.a_option_1').attr('selected','selected');
							// 학생의 현재 출결상태에 따라 출력되는 스크롤박스가 달라짐.
							if (value.a_status == '출석') {
								$('.a_option_1').html(value.a_status);
								$('.a_option_2').html('지각');
								$('.a_option_3').html('결석');
							} else if (value.a_status == '지각') {
								$('.a_option_1').html(value.a_status);
								$('.a_option_2').html('출석');
								$('.a_option_3').html('결석');
							} else if (value.a_status == '결석') {
								$('.a_option_1').html(value.a_status);
								$('.a_option_2').html('지각');
								$('.a_option_3').html('출석');
							}else if (value.a_status == '미퇴실') {
								$('.a_option_1').html(value.a_status);
								$('.a_option_2').html('출석');
								$('.a_option_3').html('결석');
							}else if (value.a_status == '지각(미퇴실)') {
								$('.a_option_1').html(value.a_status);
								$('.a_option_2').html('지각');
								$('.a_option_3').html('결석');
							}else if (value.a_status == '-') {
								$('.a_option_1').html('-');
								$('.a_option_2').html('출석');
								$('.a_option_3').html('결석');
							}
							// 출결정보에 대한 번호를 전역변수에 담는다.->출결수정을 위한 컬럼을 찾기위해.
							temp_no = value.a_no;
						});
			});
			}else{
				$('.existAt').remove();
				$('#student-list-div').append($('<p></p>').addClass('existAt').html('해당 정보가 없습니다!'));
			}
		}

	});

};


$('#present-update').live(
		'change',
		function(e) {
			e.stopImmediatePropagation();
			$.ajax(AppContext.rootPath + '/auth/changeStatus.do', {
				type : 'POST',
				dataType : 'json',
				data : {
					a_status : $('span[class^=a_option]').html(),
					a_no : temp_no
				},
				success : function() {
					alert('출결수정이 되었습니다.');
					$('.ui-btn-text > span[class^=a_option]').removeClass()
							.addClass('a_option_1');
					$('#present-confirm').trigger('click');
					remove_list();
					inform();
				},
				error : function(xhr, status, message) {
					alert(message);
				}
			});
		});

//기존에 출력된 리스트를 다삭제 시켜주는 메서드
function remove_list() {
	$('.student-list-title').empty();
	$('.student-list-title').remove();
	$('.student-list-line').empty();
	$('.student-list-line').remove();
};
