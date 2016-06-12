document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	document.addEventListener("backbutton", backKeyDown, true);
}

function backKeyDown() {}

$(document).ready(function() {
	$("#yellow").css({overflow:'hidden'}).bind('touchmove', function(e){e.preventDefault()});
	$("#purple").css({overflow:'hidden'}).bind('touchmove', function(e){e.preventDefault()});

	//JSON
	requestSubjects();
    // 첫번재 리스트 open할 경우
	//title click시 accordion 효과 처리 -> on 메소드사용으로 동적으로 생성되는 리스트에 대해 click이벤트 live시킴
	//이벤트 버블링으로 인해 click이벤트가 여러번 적용되는 문제 -> off메소드 사용하여 이벤트 버블링으로 인한 문제 수정
	$(document).off('click','div[class^=accordion] > .t_accordion_title');
	$(document).on('click','div[class^=accordion] > .t_accordion_title', function(event){
    	if($(this).attr('class')!= 't_accordion_title active'){
    		$('#red_content .t_accordion_sub').slideUp('fast');
    		$(this).next().slideDown('fast');
    		
    		$('#red_content .t_icon').rotate({animateTo:0});
    		$(this).find('.t_icon').rotate({animateTo:-180});
    		
    		$('#red_content .t_accordion_title').removeClass('active');
    		$(this).addClass('active');

    	}else{
    		$(this).next().slideUp('fast');
    		$(this).find('.t_icon').rotate({animateTo:0});
    		$(this).removeClass('active');
    	}
    	
    });
	
	
	
	h=$('.t_accordion_sub').length; //어코디언 서브의 클래스를 가진 갯수
	for(var j=0; j<h; j++){ //갯수만큼 for문
	$(document).off('change', '#regSelect'+j); 
	$(document).on('change', '#regSelect'+j, function(data){ //해당하는 아코디언의 온오프 버튼 바꿀시
		
		temps = this;
		
		
		//강좌등록 ON/OFF 처리
		$.ajax(AppContext.rootPath + '/t_regStudent.do',{
		type:'POST',
		dataType:'json',
		data: {
			//this는 select 메서드. class값으로 
			l_no : $(this).attr('name'),  //for문이 ajax에서는 수행뒤 j값을 받으므로 this를 써서 동적인 값을 받아옴
			regStat : $(this,'option:selected').val()

		},
		success:function(data){
//			console.log(this);//this 객체는 object ajax 요청객체 
if($(temps,'option:selected').val()=='on'){//그러므로 위에 전역변수로 <select>부분 설정해줌
				
				alert('강좌등록ON');
				//옵션을 비우고 새로 설정
				$(temps,'option').empty();
				$(temps).append($('<option></option>').attr('value','on').html('강좌등록On')).append($('<option>').attr('value','off').html('강좌등록Off'));
			}else{
				alert('강좌등록OFF');
				$(temps,'option').empty();
				$(temps).append($('<option></option>').attr('value','off').html('강좌등록Off')).append($('<option>').attr('value','on').html('강좌등록On'));
			}
		}
	});
	});
	}
    
	
});


function requestSubjects(){
	temp = 0;
	
	//동기, 비동기 처리를 해줄수 있다
	$.ajaxSetup({
		async: false
	});
	
	//강좌리스트 생성
	$.ajax(AppContext.rootPath + '/t_lecture.do',{
    	type : 'GET',
    	dataType : 'json',
    	success : function(subjects){
    		
    		if(subjects.status == 'success'){
    			var tagAccordion = null;
    			var subTagAccordion = null;
    			
    			//받아온 값만큼 for문을 돌린다.
    			for(var i =0; i<subjects.subject.length; i++){
    				
    				if(subjects.subject[i].l_nfc_num != undefined){
    					$('#red_content').append("<div class='accordion"+i+"'></div>");
    					$('.accordion'+i).append($("<div class='t_accordion_title'><ul></ul></div>"))
    					.append($("<div class='t_accordion_sub'><ul></ul></div>"));
    					
    					tagAccordion = $(".accordion"+i+" > .t_accordion_title > ul");
    					subTagAccordion = $(".accordion"+i+" > .t_accordion_sub > ul");
    					
    					//공지내용 출력 p태그에 i를 줘서 동적으로 클래스가 생성
    					tagAccordion.append($('<li></li>').html('<img class="t_icon" src="../img/list/down_icon.png">'))
    					.append($('<li></li>').html('<h2>'+subjects.subject[i].l_name+'</h2>'))
    					.append($('<li></li>').html("<img class='thumbnail' src='../img/home.png'><span>"+subjects.subject[i].l_room +'</span>'+
    							"<img class='thumbnail' src='../img/company.png'><span>"+subjects.subject[i].l_a_group+'</span>'));
//		    						.append($('<li></li>').html('<span>강좌명 : </span>'+subjects.subject[i].l_name+'<span>,  강의실 : </span>'+subjects.subject[i].l_room +'<span>,  소속 : </span>'+subjects.subject[i].l_a_group))
    					
    					//ajax요청을 한번더 해서 강의 요일과 강의시간 값을 받아온다.
    					$.ajax(AppContext.rootPath + '/t_lecture_time.do?l_no='+subjects.subject[i].l_no,{
    						type : 'GET',
    						dataType : 'json',
    						success : function(data){
    							//받아온 데이터의 갯수가 결국 강의 요일 갯수니깐 전역변수로 요일수를 설정
    							//프로그래스 바 계산을 하기위해서 설정.
    							date_length = data.subject.length;
    							
    							//받아온 배열반큼 리스트에 append 시켜준다.
    							$.each(data.subject,function(key, value){
    								
    								var sTimeArr = data.subject[key].l_s_time.split(":");
    								var eTimeArr = data.subject[key].l_e_time.split(":");
    								
    								var sTime = sTimeArr[0]+":"+sTimeArr[1];
    								var eTime = eTimeArr[0]+":"+eTimeArr[1];
    								
    								subTagAccordion.append($('<li></li>').html("<span class='subDate'>"+data.subject[key].l_date+'요일</span>'+
    										'<span>시간 : '+sTime+'~' + eTime+'</span>'));
    							});
    						}
    					});
    					
    					subTagAccordion.append($("<li></li>").addClass('content').html('<h4> ※공지사항 [등록하려면 클릭]</h4>')
    							.append($('<p></p>').addClass('temp'+i)));
    					
    					//getJSON을 동기화로 바꾸어줌으로써 for문 동작을 먼저 실행시키지 않게 한다.
    					$.ajaxSetup({
    						async: false
    					});
    					
    					//ajax요청을 한번더 해서 강의공지사항 정보를 받아온다.
    					//생성된 강좌의 번호를 넘겨준다
    					$.getJSON(AppContext.rootPath + '/t_notice.do?l_no='+subjects.subject[i].l_no,function(data){
    						for(var j in data.notice){
    							//생성된 동적 클래스에 받아온 데이터배열들을 하나씩 붙인다.
    							$('.temp'+i).append(data.notice[j].n_content + '<br>');
    						}
    					});
    					
    					
    					$(".accordion"+i+" .content").wrap('<a href="t_lecture_text.html?l_no=' + subjects.subject[i].l_no +
    					'" data-transition="none" style="text-decoration:none;color:black;"></a>');
    					
    					subTagAccordion.append($("<li><span class='startDate'>"+subjects.subject[i].l_s_day+
    							"</span><span class='endDate'>"+subjects.subject[i].l_e_day+
    					"</span></li>"));
    					
    					subTagAccordion.append($("<li class='progressbar"+i+"'></li>"));
    					
    					var percent = calculationPercent(subjects.subject[i]);
    					$('.progressbar'+i).progressbar({
    						value:percent
    					});
    					
    					subTagAccordion.append($("<li><p class='percent'>"+percent+"%</p></li>"));
    					
    					
    					//select에 name을 동적으로 생성하는데 받아오는 값은 그 강좌에 대한 번호를 받아와서 ON/OFF 기능을 사용할때 쓴다.
    					subTagAccordion.append($('<select></select>').attr('id','regSelect'+i).attr('name',subjects.subject[i].l_no).attr('data-mini','true')/*.html("<option value='off'>강좌등록Off</option><option value='on'>강좌등록On</option>")*/);
    					subTagAccordion.append("<div style='height:10px;'></div>");
    					
    					//동적으로 생성되는 jquery mobile 사용하는 select에 강제적으로 create 수행하여 style적용
    					subTagAccordion.trigger('create');
    					
    					//강좌등록 상태 불러오는 조건문
    					if(subjects.subject[i].s_reg_onoff == 'on'){
		    				$('.accordion'+i+' .ui-btn-text>span').html('강좌등록On');
		    				$('#regSelect'+i).append($('<option>').attr('value','on').addClass('on').html('강좌등록On'))
		    				.append($('<option>').attr('value','off').addClass('off').html('강좌등록Off'));
		    				
		    			}else if(subjects.subject[i].s_reg_onoff == 'off'){
		    				$('.accordion'+i+' .ui-btn-text>span').html('강좌등록Off');
		    				$('#regSelect'+i).append($('<option>').attr('value','off').html('강좌등록Off'))
		    				.append($('<option>').attr('value','on').html('강좌등록On'));
		    			}else{
		    				$('.accordion'+i+' .ui-btn-text>span').html('강좌등록Off');
		    				$('#regSelect'+i).append($('<option>').attr('value','off').html('강좌등록Off'))
		    				.append($('<option>').attr('value','on').html('강좌등록On'));
		    			}
    					
    				}else{
    					$('#red_content').append("<div class='accordion"+i+"'></div>");
    					//미등록 태깅화면으로 넘길때 그 강좌의 번호를 같이 넘겨준다.
    					$('.accordion'+i).append($("<div class='unregistered_title'><a href='t_tagging.html?l_no="+ subjects.subject[i].l_no +
    					"'data-transition='none'><ul></ul></a></div>"));
    					
    					tagAccordion = $(".accordion"+i+" > .unregistered_title ul");
    					
    					tagAccordion.append($('<li></li>').html('<img class="t_icon" src="../img/list/unregistered_icon.png">'))
    					.append($('<li></li>').html('<h3>강좌명 : '+subjects.subject[i].l_name+'</h3>'))
    					.append($('<li></li>').html('<span>강의실 : '+subjects.subject[i].l_room +'</span>'+
    							'<span></span>'+
    							'<span>소속 : '+subjects.subject[i].l_a_group+'</span>'));	
    					
    				}
    			}
    		}else{
    			$('#red_content')
				.append("<center><h4 id='noRegMessege'>등록된 강좌가 없습니다</h4></center>");
    		}
    	},
    	error:function(xhr,status,message){
    		window.alert(message);
    	}
    });
}

function calculationPercent(subject){
	var today = new Date();
	
	var numberOfClass = date_length;
	var startDateArr = subject.l_s_day.split("-");
	var sDate = new Date(startDateArr[0],startDateArr[1]-1,startDateArr[2]);
	
	var endDateArr = subject.l_e_day.split("-");
	var eDate = new Date(endDateArr[0],endDateArr[1]-1,endDateArr[2]);
	
	var totalDate = eDate.getTime()-sDate.getTime();
	var currentDate = today.getTime()-sDate.getTime();
	
	totalDate = Math.floor(totalDate/(1000*60*60*24));
	currentDate = Math.floor(currentDate/(1000*60*60*24));
	
	var percent = Math.floor((((currentDate / 7) * numberOfClass) / ((totalDate / 7) * numberOfClass)) * 100);
	if(percent > 100){
		percent = 100;
	}
	return percent;
	
}


