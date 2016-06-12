$(document).ready(function(){
	
	loginStatus = 0;//등록을 할시 이값이 1이 아니면 예외처리
	//중복확인 처리
	$('#t_duplicateBtn').click(function(){
		$.ajax(AppContext.rootPath+'/auth/t_duple.do',{
			type : 'POST',
			dataType : 'json',
			data : {
				t_email : $('#t_email').val() //입력받은 이메일 값을 넘김
			},
			success:function(){
				alert("존재하는 계정입니다!!");
			
			},
			error:function(xhr, status, message){
				window.alert("사용가능한 계정입니다");
			}
		});
		loginStatus = 1;
	});
	
	

	
	//등록버튼 처리, 
	$('#t_regBtn').click(function(){
		if($('#t_name').val()==""){
			alert("이름을 입력해주세요"); //빈칸일 경우 예외처리
		}else if($('#t_tel').val()==""){
			alert("전화번호를 입력해주세요");
		}else if($('#t_email').val()==""){
			alert("Email을 입력해주세요");
		}else if($('#t_password').val()==""){
			alert("패스워드를 입력해주세요");
		}else if($('#t_pwConfirm').val()==""){
			alert("패스워드를 한번더 입력해주세요");
		}else{
			if($('#t_password').val()==$('#t_pwConfirm').val()){
				//중복확인을 누르지 않았을 경우
				if(loginStatus == 0){
					alert("Email중복 확인을 해주세요");
				}else{
				$.ajax(AppContext.rootPath+'/auth/t_join.do',{
					type:'POST',
					dataType : 'json',
					data: {//가입시 필요한 모든 값을 넘겨준다.
						t_name : $('#t_name').val(),
						t_ph : $('#t_tel').val(),
						t_email : $('#t_email').val(),
						t_password : $('#t_password').val(),
						//프로필 사진 등록안된 상태
						t_picture : "absent.jpg"
					},
					success: function(){
						alert("가입되었습니다");
						$.mobile.defaultPageTransition = "none";
						$.mobile.changePage('t_login.html');
						
					},
					//PK인 이메일이 중복 들어갈경우 요청이 실패한다.
					error : function(xhr, status, message){
						alert("중복된 계정입니다");
					}
				});
				}
			}else{//확인비밀번호와 비밀번호가 일치 하지 않을 경우
				alert('비밀번호가 일치하지 않습니다');
			}
		}

});
	
});