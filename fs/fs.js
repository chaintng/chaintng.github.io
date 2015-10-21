  var map;
  function init() {
  	map = new longdo.Map({
  		placeholder: document.getElementById('map')
  	});
    map.Event.bind('beforeContextmenu', openContextMenu);
  	$('#tophotel').change(function(){
  		hotelItem = hotelJson[$(this).val()];
  		$('#latlon').val(hotelItem.latitude + ", " + hotelItem.longitude);
  	});
  }

  function showNearBy(){
  	map.Overlays.clear();
  	lonval = $('#latlon').val().split(',')[1].trim();
  	latval = $('#latlon').val().split(',')[0].trim();
  	sendData = {
  			ll: latval + ', ' + lonval,
			section: $('#section').val(),
			locale: 'en',
		};
	if($('#radius').val() != ""){
		sendData.radius = $('#radius').val();
	}	
  	map.location({lon:lonval, lat:latval});
  	$.ajax("https://api.foursquare.com/v2/venues/explore?v=20130815&client_id=VZTOKRYT2YB1ECOF3X1Q10FWPFQ5SI2ZMIJ0OW15ECUU2FAR&client_secret=0YATSWV0PJSNOJURN3TXDXKVTOFP3GFIR0ABFTP5ZYV2PPW3%20&open", {
  		data: sendData
	})
  	.done(function(result){
  		var output = '';
  		groups = result.response.groups;
  		categoryList = {};
  		groups.forEach(function(b){
  			output += '<h1>'+b.type+'</h1><ul>'
  			items = b.items;
  			poiList = [];
  			items.forEach(function(ei){
  				itemCategory = ei.venue.categories[0];
  				output += '<li><img src="'+itemCategory.icon.prefix+'bg_32.png" class="icon" alt="'+itemCategory.name+'"/> ';
  				output += ei.venue.name+' [<a href="#" class="toggle-desc">Show</a>]';
  				output += '<div class="hide desc"><pre class="prettyprint">'+JSON.stringify(ei, null, 2)+'</pre></div></li>';
  				poiList.push({lon: ei.venue.location.lng, lat: ei.venue.location.lat});
  				detail = '';
  				categoryName = itemCategory.name;
  				categoryList[categoryName] = (typeof categoryList[categoryName] == "undefined") ? 1 : categoryList[categoryName] + 1;
  				detail += "<b>" + categoryName + "</b><br/>";
  				if(ei.tips){
  					if(typeof ei.tips[0].photourl != 'undefined'){
  						detail += "<img src='"+ei.tips[0].photourl+"' style='width:100px;float:left'/>";
  					}
  					detail += ei.tips[0].text;
  				}
  				tmpMarker = new longdo.Marker({lon: ei.venue.location.lng, lat: ei.venue.location.lat}, 
  				{
  					title: ei.venue.name,
  					detail: detail,
  					size: {width: 300}
  				});
  				map.Overlays.add(tmpMarker);
  			});
  			appropriateZoom(map, poiList);
  			output += '</ul>';
  		});
  output = "<h3><a onclick='showCategory()'>See Category List</a></h3><pre class='prettyprint category-list hide'>"+JSON.stringify(categoryList, null, 2)+"</pre>" + output;
  $('#output').html(output);
  window.prettyPrint();
  $('.toggle-desc').click(function(){
  	if($(this).parent().find('.desc').hasClass('hide')){
  		$(this).parent().find('.desc').removeClass('hide');
  	}else{
  		$(this).parent().find('.desc').addClass('hide');
  	}
  });
});
}

openContextMenu = function(e) {
    var locationJson = JSON.stringify(e.location);
    e.add('<div class=""><a onClick=\'searchPoiFromPoint(' + locationJson + ')\'>ค้นหา POI บริเวณนี้</a></div>');
}

function searchPoiFromPoint(latLon){
  $('#latlon').val(latLon.lat + ", " + latLon.lon);
  showNearBy();
}
function showCategory(){
  	if($('.category-list').hasClass('hide')){
		$('.category-list').removeClass('hide');
  	}else{
		$('.category-list').addClass('hide');
  	}
}