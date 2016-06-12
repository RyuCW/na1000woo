$(document).ready(function(){
	t_inform();
	
	//빈 사진을 클릭하면 실행 
	$('.picture').click(function() {
		//function을 실행하고 파라미터로 폰갭 카메라 포토 라이브러리를 넘긴다.
		getPhoto(pictureSource.PHOTOLIBRARY);
	});
	
});


var pictureSource; 
var destinationType; 

//디바이스가 준비가 되면 function을 실행하여 전역변수를 준비한다.
document.addEventListener("deviceready", onDeviceReady, false);

//폰갭에서 카메라관련 파라미터를 가져와서 전역변수에 담는다.
function onDeviceReady() {
	pictureSource = navigator.camera.PictureSourceType;
	destinationType = navigator.camera.DestinationType;
}

//사진을 불러오는 function
function getPhoto(source) {
	//성공하면 onPhothURISuccess메소드로 이동
	navigator.camera.getPicture(onPhotoURISuccess, onFail, {
		//가져올때의 이미지옵션을 설정해준다.
		//이미지 해상도
		quality : 50,
		//가져온 이미지의 포맷형태를 정의(base64 or URI)
		destinationType : destinationType.DATA_URL,
		//어디서 이미지를 가져올것인지를 설정(앨범,라이브러리,카메라)
		sourceType : source
	});
}

//사진가져오기 실패했을 경우
function onFail(message) {
	alert('사진선택을 취소하셨습니다.');
} 

//사진 가져오기 성공했을경우
function onPhotoURISuccess(imageURI) {
	//photo libraly에서 가져온 사진파일을 largeImage class에 삽입
	var largeImage = document.getElementById('largeImage');
	largeImage.style.display = 'block';
	largeImage.src = "data:image/jpeg;base64,"+imageURI;
	
	//서버로 전송하는 function 실행
	uploadPhoto(imageURI);
}

function uploadPhoto(imageURI){
	//사진file server에 upload
	
	
	   // send the data
	   $.ajax(AppContext.rootPath+'/auth/t_regPicture.do', {
		  type : 'POST',
		  data : {
			  image : imageURI
		  },
		  success : function(data){
			  alert("사진이 등록 되었습니다");
		  },
		  error : function(xhr, status, message){
		  }
	   });

}


//개인정보 출력
function t_inform(){
	$.ajax(AppContext.rootPath+'/auth/loginInform.do', {
		type : 'GET',
		dataType : 'json',
		success : function(data){//데이터를 받아와서 각 폼에 insert
			$('#t_info_name').html(data.teacher.t_name);
			$('#t_info_mail').html(data.teacher.t_email);
			$('#t_info_addr').html(data.teacher.t_addr);
			$('#t_info_ph').attr('value',data.teacher.t_ph);
			//기존에 존재하던 이미지태그를 지운다.
			$('#largeImage').remove();
			//이미지태그를 생성하고 속성을 다 준후, DB에 저장된 picture명을 받아와서 이미지 src에 추가한다.
			$('.picture').append($('<img></img>').attr('id','largeImage').addClass('picture_img').
					attr('src', AppContext.rootPicture + '/picture/'+ data.teacher.t_picture));

			//수정 form의 input박스에 기존 내용 출력
			$('#t_inform_addr').attr('value', data.teacher.t_addr);
			$('#t_inform_mail').attr('value', data.teacher.t_email);
			$('#t_inform_ph').attr('value', data.teacher.t_ph);
		},
		error:function(xhr, status, message){
			window.alert(message);
		}
		
		
	});
	
	
	//전화번호 수정
	$('#t_ph_change').click(function(){
		$.ajax(AppContext.rootPath+'/auth/t_ph_change.do',{
			type : 'POST',
			dataType : 'json',
			data : {
				//바뀐 데이터 값을 넘겨준다.
				t_ph : $('#t_inform_ph').val()
			},
			success : function(data){
					//요청완료시 a태그를 강제 클릭하여 a태그경로로 넘겨준다
					//이유는? location.href 로 넘길시 새로운 페이지가 로딩됨으로
					//스크립트를 불러오지 못한다
					$('.trig_bt').trigger('click');
			},
			error : function(xhr, status, message){
				window.alert(message);
			}
			
		});
	});
	
	
	//주소 수정
	//전화번호 수정과 동일
	$('#t_addr_change').click(function(){
		$.ajax(AppContext.rootPath+'/auth/t_addr_change.do',{
			type : 'POST',
			dataType : 'json',
			data : {
				t_addr : $('#t_inform_addr').val()
			},
			success : function(data){
					$('.trig_bt').trigger('click');
			},
			error : function(xhr, status, message){
				window.alert(message);
			}
			
		});
	});
	
};