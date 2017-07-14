$(document).ready(function () {
	$('.deleteUser').on('click', deleteUser);
});

function deleteUser(){
	var confirmation = confirm('Are You Sure?');
	alert(1);
		if(confirmation){
		$.ajax({
			type: 'DELETE',
			url: '/users/delete/'+$('.deleteUser').data('id');

		}).done(function(response){
			window.location.replace('/');
		});
	}else{
		return false;
	}
}