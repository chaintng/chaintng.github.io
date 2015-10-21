  var map;
  var activeInfoWindow;
  
  function init() {
    var mapProp = {
      center:new google.maps.LatLng(51.508742,-0.120850),
      zoom:5,
      mapTypeId:google.maps.MapTypeId.ROADMAP
    };
    map=new google.maps.Map(document.getElementById("map"),mapProp);
    map.addListener('rightclick', function(e){
    	searchPoiFromPoint(e.latLng.lat() + ", " + e.latLng.lng());
    });
    $('#tophotel').change(function(){
  		hotelItem = hotelJson[$(this).val()];
  		$('#latlon').val(hotelItem.latitude + ", " + hotelItem.longitude);
  	});
	$('body').on('mouseenter', 'li', function(){
		markers[$(this).attr('target')].setAnimation(google.maps.Animation.BOUNCE);
	});
	
	$('body').on('mouseout', 'li', function(){
		markers[$(this).attr('target')].setAnimation(null);
	});
  }

  var markers = [];

  function showNearBy(){
  	clearMarkers();
  	lonval = $('#latlon').val().split(',')[1].trim();
  	latval = $('#latlon').val().split(',')[0].trim();
  	hotelIcon = {url: 'pinkpin.png', size: new google.maps.Size(20, 20), origin: new google.maps.Point(0,0),
    	anchor: new google.maps.Point(0, 20)};
	var hotelMarker=new google.maps.Marker({
		position: new google.maps.LatLng(latval,lonval),
		animation: google.maps.Animation.DROP,
		icon: 'hotel-icon.png',
	});
	hotelMarker.setMap(map);
	markers.push(hotelMarker);
//   	var hotelMarker = new longdo.Marker({ lon: lonval, lat: latval },
// 	{
// 	  title: 'Search Position',
// 	  icon: {
// 		url: 'http://map.longdo.com/mmmap/images/pin_mark.png',
// 		offset: { x: 12, y: 45 }
// 	  },
// 	  detail: 'Search Position'
// 	});
// 	map.Overlays.add(hotelMarker);

  	sendData = {
  			ll: latval + ', ' + lonval,
			section: $('#section').val(),
			locale: 'en',
		};
	if($('#radius').val() != ""){
		sendData.radius = $('#radius').val();
	}	
	map.setCenter(hotelMarker.getPosition());
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
  			var latlngbounds = new google.maps.LatLngBounds();
  			var i = 1;
  			items.forEach(function(ei){
  				itemCategory = ei.venue.categories[0];
  				output += '<li target="'+i+'"><img src="'+itemCategory.icon.prefix+'bg_32.png" class="icon" alt="'+itemCategory.name+'"/> ';
  				output += ei.venue.name+' [<a href="#" class="toggle-desc">Show</a>]';
  				output += '<div class="hide desc"><pre class="prettyprint">'+JSON.stringify(ei, null, 2)+'</pre></div></li>';
  				
  				detail = '';
  				categoryName = itemCategory.name;
  				categoryList[categoryName] = (typeof categoryList[categoryName] == "undefined") ? 1 : categoryList[categoryName] + 1;
  				detail += "<b>" + ei.venue.name + "</b> - <i>"+categoryName+"</i><br/>";
  				if(ei.tips){
  					if(typeof ei.tips[0].photourl != 'undefined'){
  						detail += "<img src='"+ei.tips[0].photourl+"' style='width:100px;float:left'/>";
  					}
  					detail += ei.tips[0].text;
  				}
  					tmpMarker = new google.maps.Marker({
					  position: new google.maps.LatLng(ei.venue.location.lat,ei.venue.location.lng),
						animation: google.maps.Animation.DROP,
					});
					tmpMarker.target = i;
					attachPopupDetail(tmpMarker, detail);
					tmpMarker.setMap(map);
					markers.push(tmpMarker);
					latlngbounds.extend(tmpMarker.position);
//   				map.Overlays.add(tmpMarker);
				i++;
  			});
  			map.fitBounds(latlngbounds);
//   			appropriateZoom(map, poiList);
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
  $('#latlon').val(latLon);
  showNearBy();
}
function showCategory(){
  	if($('.category-list').hasClass('hide')){
		$('.category-list').removeClass('hide');
  	}else{
		$('.category-list').addClass('hide');
  	}
}

function clearMarkers(){
	markers.forEach(function(item){
		item.setMap(null);
	});
}

function attachPopupDetail(marker, detail){
	marker['infowindow'] = new google.maps.InfoWindow({
		content: detail
	});
	marker.addListener('click', function(){
        if ( activeInfoWindow == this['infowindow'] ) {
            return;
        }
        if ( activeInfoWindow ) {
            activeInfoWindow.close();
        }

        this['infowindow'].open(map, this);
        activeInfoWindow = this['infowindow'];
	});
}