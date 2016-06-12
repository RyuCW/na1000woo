$(document).ready(function(){
	s_inform();
	$('#s_addrChangeBtn').click(addrChange);
	$('#s_phChangeBtn').click(phChange);
	
	$('.picture').click(function() {
		getPhoto(pictureSource.PHOTOLIBRARY);
	});
});

function s_inform(){
	$.ajax(AppContext.rootPath+'/auth/s_infoShow.do',{
		type:'GET',
		dataType:'json',
		success : function(data){
			$('#s_info_email').html(data.student.s_email);
			$('#s_info_name').html(data.student.s_name);
			$('#s_info_addr').html(data.student.s_addr);
			$('#s_info_ph').attr('value',data.student.s_ph);
			
			$('#largeImage').remove();
			//이미지태그를 생성하고 속성을 다 준후, DB에 저장된 picture명을 받아와서 이미지 src에 추가한다.
			$('.picture').append($('<img></img>').attr('id','largeImage').addClass('picture_img').
					attr('src',AppContext.rootPicture + '/picture/'+ data.student.s_picture));
			
			$('#s_inform_addr').attr('value', data.student.s_addr);
			$('#s_inform_ph').attr('value', data.student.s_ph);
		}
	});
};

function addrChange(){
	if($('#s_inform_addr').val() == ""){
		alert("주소를 입력하여 주세요");
	}else{
		$.ajax(AppContext.rootPath+'/auth/s_addrChange.do',{
			type:'post',
			dataType:'json',
			data:{
				s_addr : $('#s_inform_addr').val()
			},
			success : function(data){
				alert('변경되었습니다');
				$('#addrPageMove').trigger('click');
			}
		});
	}
}

function phChange(){
	if($('#s_inform_ph').val() == ""){
		alert("전화번호를 입력하여 주세요");
	}else{
		$.ajax(AppContext.rootPath+'/auth/s_phChange.do',{
			type:'post',
			dataType:'json',
			data:{
				s_ph : $('#s_inform_ph').val()
			},
			success : function(data){
				alert('변경되었습니다');
				$('#phPageMove').trigger('click');
			}
		});
	}
}

document.addEventListener("deviceready", onDeviceReady, false);

var pictureSource; 
var destinationType; 

function onDeviceReady() {
	pictureSource = navigator.camera.PictureSourceType;
	destinationType = navigator.camera.DestinationType;
}

function getPhoto(source) {
	//성공하면 onPhothURISuccess메소드로 이동
	navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
		quality : 50,
		destinationType : destinationType.DATA_URL,
//		destinationType : destinationType.FILE_URI,
		sourceType : source
	});
	
}

function onFail(message) {
	alert('사진선택을 취소하셨습니다.');
} 

function onPhotoDataSuccess(imageData) {
	//alert('onPhotoURISuccess');
	//photo libraly에서 가져온 사진파일을 largeImage class에 삽입
	var largeImage = document.getElementById('largeImage');
	largeImage.style.display = 'block';
	largeImage.src = "data:image/jpeg;base64," +imageData;
//	largeImage.src = imageData;
	
	uploadPhoto(imageData);
}

function uploadPhoto(imageData){
	var url = AppContext.rootPath+'/auth/s_pictureChange.do';
	
	$.ajax(url,{
		type:'post',
		data: {
			image : imageData
		},
		success : function(data){
			alert("사진이 등록 되었습니다");
		},
		error : function(xhr, status, message){
		}
	});
}