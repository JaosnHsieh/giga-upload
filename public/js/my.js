String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

var rootPath,currentPath;


getAndRefresh('','folder');

function deleteFile(path,abPath){
        console.log('delete path',path);
        console.log('delete abPath ',abPath);
         $.ajax({
      type:"DELETE",
      url: "/delete",
      data:{
        path:path
      },
      datatype:"json",
      success:function(data){
        getAndRefresh(abPath,'folder');
             $("#form_output").removeClass('alert-danger');
            $("#form_output").addClass('alert-success');
             $("#form_output").html("Delete Success!!").fadeIn(1000);
            $("#form_output").fadeOut(1000);
      },
      complete: function () {
      },
      error: function (xhr, ajaxOptions, thrownError) {
             $("#form_output").removeClass('alert-success');
                $("#form_output").addClass('alert-danger');
               $("#form_output").html("Delete Error!!").fadeIn(1000);
                $("#form_output").fadeOut(1000);
          console.log(xhr.responseText);
      }
  });
}
function getAndRefresh(path, type) {

    currentPath = path;



    if (type == "folder") {
        $.ajax({
            type: "GET",
            //http://192.168.0.107:8080/
            url: "/api/filesDirs?path=" + (path ? path : ''),
            //datatype: "json",
            success: function (data) {
                console.log(data);
                rootPath = data.rootPath;
                if(!path){
                    currentPath=data.rootPath;
                    }

                $("#currentPathText").text(currentPath.replace(rootPath,'\\'));



                var list = $("#listUl");
                list.empty();
                data.files.forEach(function (f) {
                    var abDirPath = (f.substring(0,f.lastIndexOf('\\'))).replaceAll('\\','\\\\');
                    if(abDirPath.indexOf('\\')==-1){
                        abDirPath+='\\\\';
                    }
                    var showName = f.substring(f.lastIndexOf('\\') + 1);
                    f = f.replaceAll('\\', '\\\\');
                    list.append('<li><i class="fa fa-file" aria-hidden="true"></i><a href=/static/'+f.substring(f.indexOf("\\\\")+1)+'>'+showName+' </a><button onclick=deleteFile(\''+f+'\',\''+abDirPath+'\') class="btn btn-danger btn-sm">Delete</button> </li>');
                });

                data.folders.forEach(function (d) {
                    var abDirPath = (d.substring(0,d.lastIndexOf('\\'))).replaceAll('\\','\\\\');
                        if(abDirPath.indexOf('\\')==-1){
                        abDirPath+='\\\\';
                    }
                    var showName = d.substring(d.lastIndexOf('\\') + 1);
                    d = d.replaceAll('\\', '\\\\');
                    list.append('<li ><i class="fa fa-folder-open" aria-hidden="true"></i><i onclick="getAndRefresh(\'' + d + '\',\'folder\');">' + showName + '</i> <button onclick=deleteFile(\''+d+'\',\''+abDirPath+'\') class="btn btn-danger btn-sm">Delete</button></li> ');

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
        console.log(123465);
        getAndRefresh(path,'folder');
    }
};




//backToBtn
$("#backToBtn").on('click',function(){
    if(currentPath!=rootPath){

        var backPath = currentPath.substring(0,currentPath.lastIndexOf('\\'));
        if(backPath.indexOf('\\')==-1){
            backPath= rootPath;
        }
        
        currentPath = backPath;
        
        console.log('backpath',backPath);
        getAndRefresh(backPath,'folder');

    }
});
//backToBtn end

//file

    function autosubmit() {

        $("#picForm").submit();
        $("#fileInput").val("");
    }
    $('#picForm').on('submit', function(e) {

    var formElem = $("#picForm");
    var formdata = new FormData(formElem[0]);

        e.preventDefault();
        $.ajax({
            
            url : '/upload?path='+currentPath,
            type: "POST",
            processData: false,
            contentType: false,
            data:formdata,
            // data: $(this).serialize(),
            mimeType: 'multipart/form-data',
            success: function (data) {
                getAndRefresh(currentPath,'folder');
                $("#form_output").removeClass('alert-danger');
                $("#form_output").addClass('alert-success');
                $("#form_output").html("Upload Success!!").fadeIn(1000);
                $("#form_output").fadeOut(1000);

                d = new Date();
            },
            error: function (jXHR, textStatus, errorThrown) {
                $("#form_output").removeClass('alert-success');
                $("#form_output").addClass('alert-danger');
                $("#form_output").html(jXHR.responseText).fadeIn(1000);
                $("#form_output").fadeOut(1000);

            }
        });
    });


//file end