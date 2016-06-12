$(document).ready(function(){
	//Local Storage에 저장되어 있는 키값들을 뽑아서 변수에 담는다
	t_id = window.localStorage.getItem('t_id');
	t_pw = window.localStorage.getItem('t_pw');
	s_id = window.localStorage.getItem('s_id');
	s_pw = window.localStorage.getItem('s_pw');
	
	//강사 아이디가 있을경우
	if(t_id!=null){
		//강사 로그인 ajax를 처리한다
		$.ajax(AppContext.rootPath+'/auth/t_login.do',{
			type : 'POST',
			dataType : 'json',
			
			//local storage에 저장된 강사이메일과 패스워드를 넘겨준다
			data : {
				t_email : t_id,
				t_pw : t_pw
			},
			success : function(data){
					if(data.status == 'success'){
						//로딩 화면 출력을 위해 changePage 메서드 사용
						$.mobile.showPageLoadingMsg();
						$.mobile.defaultPageTransition = "none";
						$.mobile.changePage('teacher/t_lecture_info.html');
//						location.href = 'teacher/t_lecture_info.html';
						
					}else{
						window.alert("사용자 아이디 또는 비번 틀림");
					}
			},
			error:function(xhr, status, message){
				window.alert(message);
			}
		});
		
		//학생아이디가 있을경우
	}else if(s_id!=null){
		$.ajax(AppContext.rootPath+'/auth/s_login.do',{
			type:'post',
			dataType:'json',
			data: {
				//local storage에 저장된 학생이메일과 패스워드를 넘겨준다
				s_email : s_id,
				s_password : s_pw
			},
			success:function(data){
				if(data.status == 'success'){
					$.mobile.showPageLoadingMsg();
					$.mobile.defaultPageTransition = "none";
					$.mobile.changePage('student/s_lecture_info.html');
				}else{
					alert('회원가입해 주세요');
				}
			},
			error:function(xhr, status, message){
				window.alert(message);
			}
		});
		
	}
	//둘다 없을 경우
	else{
		//학생, 강사 선택메뉴로 넘어간다
		location.href = 'select_main.html';
	}


});