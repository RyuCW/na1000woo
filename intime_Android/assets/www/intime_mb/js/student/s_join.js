$(document).ready(function(){
	
	var emailConfirm = false;
	$('#s_regBtn').click(function(){
		if($('#s_name').val()==""){
			alert('이름을 입력해 주세요');
		}else if($('#s_ph').val()==""){
			alert('전화번호를 입력해 주세요');
		}else if($('#s_email').val()==""){
			alert('이메일을 입력해 주세요');
		}else if($('#s_password').val()==""){
			alert('비밀번호를 입력해 주세요');
		}else if($('#s_pwConfirm').val()==""){
			alert('비밀번호 확인을 입력해 주세요');
		}else if($('#s_password').val()!=$('#s_pwConfirm').val()){
			alert('비밀번호 입력이 일치하지 않습니다');
		}else if(emailConfirm == false){
			alert('이메일 중복 확인해 주세요.');
		}else{
			$.ajax(AppContext.rootPath+'/auth/s_join.do',{
				type: 'post',
				dataType:'json',
				data: {
					s_name : $('#s_name').val(),
					s_ph : $('#s_ph').val(),
					s_email : $('#s_email').val(),
					s_password : $('#s_password').val(),
					s_picture : "absent.jpg"
				},
				success: function(){
					alert("가입되었습니다");
					$.mobile.defaultPageTransition = "none";
					$.mobile.changePage('s_login.html');
					
				}
			});
		}
	});
	
	$('#s_duplicateBtn').click(function(){
		if($('#s_email').val()==""){
			alert('이메일을 입력해 주세요');
		}else{
			$.ajax(AppContext.rootPath+'/auth/s_duplicate.do',{
				type:'post',
				dataType:'json',
				data: {
					s_email : $('#s_email').val()
				},
				success: function(data){
					if(data.status == "success"){
						alert('사용가능한 이메일 입니다');
						emailConfirm = true;
					}else{
						alert('사용중인 이메일 입니다');
					}
				},
				error: function(xhr, status, message){
					window.alert(message);
					
				}
			});
		}
	});
});