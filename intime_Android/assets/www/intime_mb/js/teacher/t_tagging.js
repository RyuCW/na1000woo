$(document).ready(function(){
	//강좌시작 버튼 눌렀을시
	$('#lec_start').click(function(){
		//강좌번호를 넘겨받은 url을 쪼개서 배열로 만든다.
		urlSplit = window.location.href.split('=');
		//생성된 태그의 번호값을 받아서 전역변수에 담는다.
		tag_Num = $('.nfcNum').html();
		
		if(tag_Num != null){
			$.ajax(AppContext.rootPath+'/auth/t_tag_reg.do',{
				type : 'POST',
				dataType : 'json',
				data : {
					l_no : urlSplit[1],
					tag_no : tag_Num
				},
				success : function(){
					window.alert("등록완료");
					$.mobile.defaultPageTransition = "none";
					$.mobile.changePage('t_lecture_info.html');
				},
				error : function(xhr, status, message){
					window.alert("실패");
				}
			});	//두개의 값을 서버로 보내서 ajax 처리한다.
			
		}else{
			alert('nfc카드를 tagging해 주세요');
		}
	});
	
});