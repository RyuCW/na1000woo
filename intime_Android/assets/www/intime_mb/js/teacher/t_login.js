$(document).ready(function(){
	$('.t_login').click(login);
	
});



//로그인 처리
function login(){
	$.ajax(AppContext.rootPath+'/auth/t_login.do',{
		type : 'POST',
		dataType : 'json',
		
		//입력받은 이메일과 패스워드를 넘겨준다
		data : {
			t_email : $('#t_email').val(),
			t_pw : $('#t_pw').val()
		},
		success : function(data){
				if(data.status == 'success'){
					
					window.localStorage.setItem('t_id', $('#t_email').val());
					window.localStorage.setItem('t_pw', $('#t_pw').val());
					//로딩 화면 출력을 위해 changePage 메서드 사용
					$.mobile.defaultPageTransition = "none";
					$.mobile.changePage('../teacher/t_lecture_info.html');
					
				}else{
					window.alert("사용자 아이디 또는 비번 틀림");
				}
		
			
		},
		error:function(xhr, status, message){
			window.alert(message);
		}
	});
	
};
