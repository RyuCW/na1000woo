document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	document.addEventListener("backbutton", backKeyDown, true);
}

function backKeyDown() {}

$(document)
		.ready(
				function() {

					// JSON
					requestSubjects();

					// 첫번재 리스트 open할 경우
					// accordion_head.first().addClass('active').next().slideDown('slow');

					$(document).off('click',
							'div[class^=accordion] > .s_accordion_title');
					// Click function
					$(document)
							.on(
									'click',
									'div[class^=accordion] > .s_accordion_title',
									function(event) {
											tagInterval = setInterval(attendTagNFC, 500);
										if ($(this).attr('class') != 's_accordion_title active') {
											$('#red_content .s_accordion_sub')
													.slideUp('fast');
											$(this).next().slideDown('fast');

											$('#red_content .s_icon').rotate({
												animateTo : 0
											});
											$(this).find('.s_icon').rotate({
												animateTo : -180
											});

											$('#red_content .s_accordion_title')
													.removeClass('active');
											// $(this).next().stop(true,true).slideToggle('fast');
											$(this).addClass('active');

										} else {
											$(this).next().slideUp('fast');
											$(this).find('.s_icon').rotate({
												animateTo : 0
											});
											// accordion_body.slideUp('fast');
											$(this).removeClass('active');
										}

									});

					// 2초마다 attendTagNFC 메서드를 실행한다.
					tagInterval = setInterval(attendTagNFC, 500);
					
					
					$('.purple').click(function(){
						clearInterval(tagInterval);
					});
					$('.yellow').click(function(){
						clearInterval(tagInterval);
					});
					$('.green').click(function(){
						clearInterval(tagInterval);
					});
					$('#red_content').click(function(){
						clearInterval(tagInterval);
					});
					
				});

// 오늘 날짜를 구하기 위한 메서드
var today = new Date();
// 달은 출력시 1작게 나오므로 +1을 해준다
var t_mon = today.getMonth() + 1;
var t_day = today.getDate();
// 10미만일 경우 앞에 0이 붙지 않으므로 삼항식을 이용하여 조건에 맞게 0을 붙여준다
t_mon = (t_mon < 10) ? "0" + t_mon : t_mon;
t_day = (t_day < 10) ? "0" + t_day : t_day;
// 산출한 오늘 날짜를 전역변수에 담는다
allToday = today.getFullYear() + '-' + t_mon + '-' + t_day;

// NFC를 이용한 출석체크 메서드
function attendTagNFC() {
	onDeviceReady();
	// nfcNum클래스명을 가진 엘리멘트의 값을 변수에 담는다.
	var nfcNum = $('.nfcNum').html();

	// nfcNum 변수가 존재할시(태그 고유번호가 찍혔을 경우)
	if (nfcNum != '') {
		// interval 함수를 멈춘다
		// clearInterval(tagInterval);

		// NFC 고유번호에 해당하는 강좌리스트를 뽑아온다
		$.ajax(AppContext.rootPath + '/auth/s_getLectureNumNFC.do', {
			type : 'POST',
			data : {
				// POST 방식으로 nfc 고유번호의 데이터를 넘긴다
				nfcNum : nfcNum
			},
			success : function(data) {
				if(data.lectures.length==0){
					alert('등록되어있지않은 강의실입니다');
					$('.nfcNum').html('');
				}else{
				// 받아온 강좌데이터를 하나씩 뽑아낸다
				$.each(data.lectures, function(key, value) {
					// 강좌명과 시작시간 종료시간을 변수에 담는다
					l_name = value.l_name;
					var s_time = value.l_s_time;
					var e_time = value.l_e_time;

					// 뽑아낸 시간값을 비교하기위해 실수형으로 parsing하여 전역변수에 담는다
					parse_sTime = parseFloat(s_time);
					parse_eTime = parseFloat(e_time);
					parse_cTime = value.l_now;

					// 그 수업의 출석체크 여부를 확인한후 출석처리를 하기위한 ajax 요청
					$.ajax(AppContext.rootPath + '/auth/existAttend.do', {
						type : 'POST',
						dataType : 'json',
						data : {
							// 강좌번호의 데이터를 넘긴다
							l_no : value.l_no
						},
						success : function(data) {
							// 데이터 요청한 값이 존재할경우(이미 한번이상 찍은상태)
							// 두번 태깅 조건을 만족하면 퇴실처리
							if (data.exist != null) {
								
								if(data.exist.a_status != '-'){
									// 현재시간이 종료시간보다 +-10분 사이일경우 해당하는 강좌의 퇴실처리
									if (parse_eTime - 600 <= parse_cTime
											&& parse_eTime + 600 >= parse_cTime) {

										// 두번태깅시 퇴실을 처리하는 컨트롤
										$.ajax(AppContext.rootPath
												+ '/auth/doubleTag.do', {
											type : 'POST',
											dataType : 'json',
											data : {
												l_no : value.l_no
											},
											success : function() {
												alert(l_name + ' 출석-퇴실완료');
												$('.nfcNum').html('');
												$('div[class^=accordion]').remove();
												$('.a_tag').remove();
												$('.insert_title').remove();
												requestSubjects();
											},
											error : function(xhr, status, message) {
												alert('퇴실실패');
											}
										});
									} else if (parse_sTime <= parse_cTime
											&& parse_cTime <= parse_eTime) {
										alert(l_name + ' 입실처리된 수업입니다');
										$('.nfcNum').html('');
									} else if (parse_eTime + 600 < parse_cTime) {
										alert(l_name + ' 종료된 수업입니다');
										$('.nfcNum').html('');
									}
								}else{
									// 데이터 요청한 값이 없을 경우(한번도 태깅하지않은상태)
									// 현재태깅한 시간이 시작시간과 종료시간 사이일경우(지각)
									if (parse_sTime < parse_cTime
											&& parse_eTime > parse_cTime) {

										// 출석체크(입실)를 하기위한 컨트롤
										$.ajax(AppContext.rootPath
												+ '/auth/checkAttend.do', {
											type : 'POST',
											// nfc고유번호와 오늘 요일에 해당하는 강좌,
											// 오늘 날짜, 태그상태, 출석상태를 데이터로 넘긴다.
											data : {
												l_no : value.l_no,
												a_today : allToday,
												tag_stat : 1,
												stat : '지각(미퇴실)'
											},
											dataType : 'json',
											success : function(data) {
												alert(l_name + ' 지각입니다');
												$('.nfcNum').html('');
											},
											error : function(xhr, status, message) {
												alert('등록되지 않은 학생입니다');
												$('.nfcNum').html('');
											}
										});
										// 태깅한 현재시간이 수업시작시간 전으로부터 30분이내일경우(정상출석)
									} else if (parse_sTime - 1800 <= parse_cTime
											&& parse_cTime <= parse_sTime) {
										
										// 출석체크(입실)를 하기위한 컨트롤
										$.ajax(AppContext.rootPath
												+ '/auth/checkAttend.do', {
											type : 'POST',
											// nfc고유번호와 오늘 요일에 해당하는 강좌,
											// 오늘 날짜, 태그상태, 출석상태를 데이터로 넘긴다.
											data : {
												l_no : value.l_no,
												a_today : allToday,
												tag_stat : 1,
												stat : '미퇴실'
											},
											dataType : 'json',
											success : function(data) {
												alert(l_name + ' 입실했습니다');
												$('.nfcNum').html('');
											},
											error : function(xhr, status, message) {
												alert('등록되지 않은 학생입니다');
												$('.nfcNum').html('');
											}
										});
									} else {
										alert('등록되지 않은 학생입니다');
										$('.nfcNum').html('');
									}
								}
							} else {
								if (parse_sTime < parse_cTime
										&& parse_eTime > parse_cTime) {

									insertAllStudent(value);
									
									// 출석체크(입실)를 하기위한 컨트롤
									$.ajax(AppContext.rootPath
											+ '/auth/checkAttend.do', {
										type : 'POST',
										// nfc고유번호와 오늘 요일에 해당하는 강좌,
										// 오늘 날짜, 태그상태, 출석상태를 데이터로 넘긴다.
										data : {
											l_no : value.l_no,
											a_today : allToday,
											tag_stat : 1,
											stat : '지각(미퇴실)'
										},
										dataType : 'json',
										success : function(data) {
											alert(l_name + ' 지각입니다');
											$('.nfcNum').html('');
										},
										error : function(xhr, status, message) {
											alert('등록되지 않은 학생입니다');
											$('.nfcNum').html('');
										}
									});
									// 태깅한 현재시간이 수업시작시간 전으로부터 30분이내일경우(정상출석)
								} else if (parse_sTime - 1800 <= parse_cTime
										&& parse_cTime <= parse_sTime) {
									
									insertAllStudent(value);
									
									// 출석체크(입실)를 하기위한 컨트롤
									$.ajax(AppContext.rootPath
											+ '/auth/checkAttend.do', {
										type : 'POST',
										// nfc고유번호와 오늘 요일에 해당하는 강좌,
										// 오늘 날짜, 태그상태, 출석상태를 데이터로 넘긴다.
										data : {
											l_no : value.l_no,
											a_today : allToday,
											tag_stat : 1,
											stat : '미퇴실'
										},
										dataType : 'json',
										success : function(data) {
											alert(l_name + ' 입실했습니다');
											$('.nfcNum').html('');
										},
										error : function(xhr, status, message) {
											alert('등록되지 않은 학생입니다');
											$('.nfcNum').html('');
										}
									});
								} else {
//									alert('등록되지 않은 학생입니다6');
									$('.nfcNum').html('');
								}
							}
						},
						error : function(xhr, status, message) {
							alert('요청실패');
						}
					});

				});
			}},
			error : function(xhr, status, message) {
				alert(message);
			}
		})
	} else {// nfcNum 변수가 존재하지 않을경우
	}
}

//등록되있는 전체 학생 status'-'상태로 insert하는 메소드 
function insertAllStudent(value){
	//전체 insert하기 전에 등록된 학생들 목록 가져옴
	$.ajax(AppContext.rootPath+'/auth/selectRegStudent.do',{
		type:'post',
		data:{
			l_no : value.l_no,
		},
		dataType:'json',
		success: function(data){
			if(data.status == 'success'){
				for(var i in data.studentList){
					//오늘날짜의 해당 강좌에 등록되어 있는 모든 학생을 attend 테이블에 기본적으로 insert해주는 proccess 
					$.ajax(AppContext.rootPath+'/auth/insertAllStudent.do',{
						type:'post',
						data:{
							s_email : data.studentList[i].s_email,
							l_no : value.l_no,
							a_today : allToday,
							stat : '-'
						},
						dataType:'json',
						success: function(data){
//							alert('success');
						},
						error : function(xhr, status, message) {
							alert('insertAllStudent fail1');
						}
					});
				}
			}else{
				alert('insertAllStudent fail');
			}
		},
		error : function(xhr, status, message) {
			alert('insertAllStudent fail');
		}
	});
}

function requestSubjects() {
	$.ajaxSetup({
		async : false
	});

	$
			.ajax(
					AppContext.rootPath + '/s_getLecture.do',
					{
						type : 'GET',
						dataType : 'json',
						success : function(subjects) {

							if (subjects.status == 'success') {
								var tagAccordion = null;
								var subTagAccordion = null;

								for ( var i in subjects.subject) {
									var numberOfClass = null;

									$('#red_content').append(
											"<div class='accordion" + i
													+ "'></div>");
									$('.accordion' + i)
											.append(
													$("<div class='s_accordion_title'><ul></ul></div>"))
											.append(
													$("<div class='s_accordion_sub'><ul></ul></div>"));

									tagAccordion = $(".accordion" + i
											+ " > .s_accordion_title > ul");
									subTagAccordion = $(".accordion" + i
											+ " > .s_accordion_sub > ul");

									tagAccordion
											.append(
													$("<li><img class='s_icon' src='../img/list/down_icon.png'></li>"))
											.append(
													$("<li><h2>"
															+ subjects.subject[i].l_name
															+ "</h2></li>"));

									$
											.ajax(
													AppContext.rootPath
															+ '/s_getTeacherName.do',
													{
														type : 'post',
														dataType : 'json',
														data : {
															l_no : subjects.subject[i].l_no
														},
														success : function(data) {
															tagAccordion
															.append($("<li><img class='thumbnail' src='../img/home.png'><span>"+subjects.subject[i].l_room+"</span>"
																	+ " <img class='thumbnail' src='../img/user.png'><span>"+ data.teacherName.t_name+"</span>"
																	+ "</li>"));
														}
													});

									$
											.ajax(
													AppContext.rootPath
															+ '/s_getLectureTime.do',
													{
														type : 'post',
														dataType : 'json',
														data : {
															l_no : subjects.subject[i].l_no
														},
														success : function(data) {
															for ( var j in data.lectureTime) {
																var sTimeArr = data.lectureTime[j].l_s_time.split(":");
							    								var eTimeArr = data.lectureTime[j].l_e_time.split(":");
							    								
							    								var sTime = sTimeArr[0]+":"+sTimeArr[1];
							    								var eTime = eTimeArr[0]+":"+eTimeArr[1];
							    								
																subTagAccordion
																		.append($("<li><span class='subDate'>"+ data.lectureTime[j].l_date+"요일</span>"
																				+ "<span>시간 : "+ sTime + " ~ " + eTime + "</span></li>"));
															}
															numberOfClass = eval(j + 1); // percent계산을
															// 위한
															// 요일
															// 횟수
															// 저장
														}
													});

									subTagAccordion.append($(
											"<li class='content'>").html(
											'<h4> ※공지사항</h4>')
											.append(
													$('<p></p>').addClass(
															's_temp' + i)));

									$
											.ajax(
													AppContext.rootPath
															+ '/s_getContent.do',
													{
														type : 'post',
														dataType : 'json',
														data : {
															l_no : subjects.subject[i].l_no
														},
														success : function(data) {
															for ( var j in data.content) {
																$('.s_temp' + i)
																		.append(
																				data.content[j].n_content
																						+ '<br>');
															}
														},
														error : function(xhr,
																status, message) {
															alert(message);
														}
													});

									subTagAccordion
											.append($("<li><span class='startDate'>"
													+ subjects.subject[i].l_s_day
													+ "</span><span class='endDate'>"
													+ subjects.subject[i].l_e_day
													+ "</span></li>"));
									subTagAccordion
											.append("<li class='progressbar"
													+ i + "'></li>");

									var percent = calculationPercent(
											subjects.subject[i], numberOfClass);

									$('.progressbar' + i).progressbar({
										value : percent
									});

									subTagAccordion
											.append("<li><p class='percent'>"
													+ percent + "%</p></li>");

									$
											.ajax(
													AppContext.rootPath
															+ '/s_getStatus.do',
													{
														type : 'post',
														dataType : 'json',
														data : {
															l_no : subjects.subject[i].l_no
														},
														success : function(data) {
															subTagAccordion
																	.append("<center><table><tr><td>출석</td><td>지각</td><td>결석</td></tr>"
																			+ "<tr><td>"
																			+ data.attend.length
																			+ "</td><td>"
																			+ data.lateness.length
																			+ "</td><td>"
																			+ data.absence.length
																			+ "</td></tr></table></center><div style='height:10px;'></div>");
														}
													});


								}

							} else {
								$('#red_content')
										.append(
												"<center><h4 id='noRegMessege'>강좌를 추가하시려면 아래클릭</h4></center>");
							}

							$('#red_content')
									.append(
											$("<a href='s_tagging.html' data-transition='none' class='a_tag'><div class='insert_title'></div></a>"));
							$('.insert_title')
									.append(
											$("<img class='insert_icon' src='../img/list/insert_icon.png'>"))
									.append("<ul><li><h4>강좌등록</h4></li></ul>");
						},
						error : function(xhr, status, message) {
							window.alert(message);
						}
					});
}

function calculationPercent(subject, numberOfClass) {
	var today = new Date();

	var startDateArr = subject.l_s_day.split("-");
	var sDate = new Date(startDateArr[0], startDateArr[1] - 1, startDateArr[2]);

	var endDateArr = subject.l_e_day.split("-");
	var eDate = new Date(endDateArr[0], endDateArr[1] - 1, endDateArr[2]);

	var totalDate = eDate.getTime() - sDate.getTime();
	var currentDate = today.getTime() - sDate.getTime();

	totalDate = Math.floor(totalDate / (1000 * 60 * 60 * 24));
	currentDate = Math.floor(currentDate / (1000 * 60 * 60 * 24));

	var percent = Math.floor((((currentDate / 7) * numberOfClass) / ((totalDate / 7) * numberOfClass)) * 100);
	if(percent > 100){
		percent = 100;
	}
	return percent;
}

