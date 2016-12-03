String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

getAndRefresh('','folder');

function deleteFile(path,abPath){
    console.log('this is path: ',path);

    // console.log('replaced ',path.replaceAll('\\','\\\\'));
         $.ajax({
      type:"DELETE",
      url: "/delete",
      data:{
        path:path
      },
      datatype:"json",
      success:function(data){
        console.log('-----------',path,abPath);
        getAndRefresh(abPath,'folder');
      },
      complete: function () {
      },
      error: function (xhr, ajaxOptions, thrownError) {
          console.log('error');
          console.log(xhr.responseText);
      }
  });
}
function getAndRefresh(path, type) {
    if (type == "folder") {
        $.ajax({
            type: "GET",
            //http://192.168.0.107:8080/
            url: "/api/filesDirs?path=" + (path ? path : ''),
            //datatype: "json",
            success: function (data) {

                var list = $("#listUl");
                list.empty();
                data.files.forEach(function (f) {
                    var abDirPath = (f.substring(0,f.lastIndexOf('\\'))).replaceAll('\\','\\\\');
                    console.log('abDirPath',abDirPath);
                    var showName = f.substring(f.lastIndexOf('\\') + 1);
                    f = f.replaceAll('\\', '\\\\');
                    list.append('<li><i class="fa fa-file" aria-hidden="true"></i><a href=/static/'+f.substring(f.indexOf("\\\\")+1)+'>'+showName+' </a><button onclick=deleteFile(\''+f+'\',\''+abDirPath+'\') class="btn btn-danger btn-sm">Delete</button> </li>');
                });

                data.folders.forEach(function (d) {
                    var abDirPath = (d.substring(0,d.lastIndexOf('\\'))).replaceAll('\\','\\\\');
                    var showName = d.substring(d.lastIndexOf('\\') + 1);
                    d = d.replaceAll('\\', '\\\\');
                    list.append('<li onclick="getAndRefresh(\'' + d + '\',\'folder\');"><i class="fa fa-folder-open" aria-hidden="true"></i><i>' + showName + '</i><button onclick=deleteFile(\''+d+'\',\''+abDirPath+'\') class="btn btn-danger btn-sm">Delete</button> </li>');

                });


            },
            complete: function () {},
            error: function (xhr, ajaxOptions, thrownError) {
                console.log('error');
                console.log(xhr.responseText);
            }
        });
    }
    // type is file
    else{
        getAndRefresh(path,'folder');
    }
};









//file

    function autosubmit() {
        $("#picForm").submit();
    }
    $('#picForm').on('submit', function(e) {
    var formElem = $("#picForm");
    var formdata = new FormData(formElem[0]);

        e.preventDefault();
        $.ajax({
            
            url : '/upload',
            type: "POST",
            processData: false,
            contentType: false,
            data:formdata,
            // data: $(this).serialize(),
            mimeType: 'multipart/form-data',
            success: function (data) {
                $("#form_output").html("Upload Success!!").removeClass('hidden').fadeOut(5000);
                d = new Date();
            },
            error: function (jXHR, textStatus, errorThrown) {
				console.log(textStatus,errorThrown);
                $("#form_output").html(jXHR.responseText);
            }
        });
    });


//file end