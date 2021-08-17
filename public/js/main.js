$('#posterUpload').on('change', function() {
    let image = $("#posterUpload")[0].files[0];
    let formdata = new FormData();
    formdata.append('posterUpload', image);
    $.ajax({
        url: '/video/upload',
        type: 'POST',
        data: formdata,
        contentType: false,
        processData: false,
        'success': (data) => {
            $('#poster').attr('src', data.file);
            $('#posterURL').attr('value', data.file); // sets posterURL hidden field
            if (data.err) {
                $('#posterErr').show();
                $('#posterErr').text(data.err.message);
            } else {
                $('#posterErr').hide();
            }
        }
    });
});