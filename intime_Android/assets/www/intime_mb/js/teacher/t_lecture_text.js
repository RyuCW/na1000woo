$(document).ready(function(){

	reg_notice();
	
});

//강좌공지사항 등록
function reg_notice(){
	
	$('#regBtn').click(function(){
		//넘겨받은 url를 쪼개서 강좌번호만 빼낸다.
		$.mobile.showPageLoadingMsg();
		notice_url = window.location.href.split("=");
		
		//그강좌 공지사항의 갯수를 카운트한다.
		$.getJSON(AppContext.rootPath+'/noticeCount.do?l_no='+notice_url[1],function(data){
			//받아온 데이터를 전역변수에 담는다.
			count = data.count;
		});
		//최대 공지 등록 갯수는 2개이므로 2개일때 등록시
		//FIFO로 데이터 처리후, 공지사항 등록
		if(count==2){
			$.getJSON(AppContext.rootPath+'/delNotice.do?l_no='+notice_url[1],function(data){
			});
			$.ajax(AppContext.rootPath+'/addNotice.do',{
				type : 'POST',
				dataType : 'json',
				data : {
					//입력한 공지내용과 강좌번호를 넘겨준다.
					n_content : $('#contentInput').val(),
					l_no : notice_url[1]
				},
				success : function(){
					window.alert('공지등록완료!');
					//업데이트된 내용을 refresh 하기위해 changePage 명령어 사용
					$.mobile.defaultPageTransition = "none";
					$.mobile.changePage('t_lecture_info.html');
				},
				error : function(xhr, status, message){
					window.alert('등록실패');
				}
			});
		}else{//2개 미만일경우 바로 공지사항 등록
			$.ajax(AppContext.rootPath+'/addNotice.do',{
				type : 'POST',
				dataType : 'json',
				data : {
					n_content : $('#contentInput').val(),
					l_no : notice_url[1]
				},
				success : function(){
					window.alert('공지등록완료!');
					$.mobile.defaultPageTransition = "none";
					$.mobile.changePage('t_lecture_info.html');
				},
				error : function(xhr, status, message){
					window.alert('등록실패');
				}
			});
		}
		

	});
};