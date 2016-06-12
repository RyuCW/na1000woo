$(document).ready(function(){
	$('.s_login').click(function(){
		if($('#s_email').val() == ""){
			$('#s_email').focus();
		}else if($('#s_password').val() == ""){
			$('#s_password').focus();
		}else{
			$.ajax(AppContext.rootPath+'/auth/s_login.do',{
				type:'post',
				dataType:'json',
				data: {
					s_email : $('#s_email').val(),
					s_password : $('#s_password').val()
				},
				success:function(data){
					if(data.status == 'success'){
						window.localStorage.setItem('s_id', $('#s_email').val());
						window.localStorage.setItem('s_pw', $('#s_password').val());
						$.mobile.defaultPageTransition = "none";
						$.mobile.changePage('s_lecture_info.html');
					}else{
						alert('사용자 아이디 또는 비번 틀림');
					}
				},
				error:function(xhr, status, message){
					window.alert(message);
				}
			});
		}
	});
});