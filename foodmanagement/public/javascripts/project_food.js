$(document).ready(function(){
    $.getJSON("http://localhost:3000/Food_type/fetchfoodtype",function(data){
      //  alert(JSON.stringify(data))
        if(data.status){
            data.ftypes.map((item)=>{
           //     alert(item.foodtype)
                $('#foodtypeid').append($('<option>').text(item.foodtype).val(item.foodtypeid))
            })
            $('#foodtypeid').formSelect();
        }
        else
        {
            alert('server error')
        }
    })

    $('#foodtypeid').change(function(){
        $.getJSON("http://localhost:3000/Food_type/fetchfoodid",{foodtypeid:$('#foodtypeid').val()},function(data){
          //  alert(JSON.stringify(data))
   if(data.status)
   {
      $('#foodid').empty()
      $('#foodid').append($('<option>').text("Choose your Dish"))
      data.result.map((item)=>{
        $('#foodid').append($('<option>').text(item.foodname).val(item.foodid))

      })
      $('#foodid').formSelect();

   }
   else
   {
    alert("Server error")
   }
        })
    })

})

