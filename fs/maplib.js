
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function getMaxZoom() {
    return mmmap2.projection().maxZoom;
}
function getMapProjection() {
    return mmmap2.projection().longdoName;
}
function mapZoom(zoom) {
    if(!mmmap2) return false;
    
    if(isNumber(zoom)) {
        mmmap2.zoom(zoom);
    } else {
        return mmmap2.zoom();
    }
}
function getMouseLocation() {
    if(!mmmap2) return false;
    return mmmap2.location(longdo.LocationMode.Pointer);
}
function getCenterLocation() {
    if(!mmmap2) return false;
    return mmmap2.location();
}
function mapBoundary(mapObj, bound) {
    if(!mapObj) return false;
    if(bound){
        mapObj.bound(bound);
// 	mapObj.zoom(false, true);
	}else
        return mapObj.bound();
}
function moveLocation(lat, lon, zoom) {
    if(!mmmap2) return false;
    if(isNumber(lat) && isNumber(lon)) {
        var rs = mmmap2.location({lat: lat, lon: lon});
    }
    if(isNumber(zoom)) {
        mmmap2.zoom(zoom);
    }
    
    if(rs == 'Invalid location') return false;
    return true;
}
function boundaryIsOutOfBoundary(boundary) {
    if(!boundary) return false;
    
    var outofboundary = false;
    
    if(!outofboundary) {
        outofboundary = isOutOfBoundary(boundary.minLat, boundary.minLon);
    }
    if(!outofboundary) {
        outofboundary = isOutOfBoundary(boundary.maxLat, boundary.minLon);
    }
    if(!outofboundary) {
        outofboundary = isOutOfBoundary(boundary.minLat, boundary.maxLon);
    }
    if(!outofboundary) {
        outofboundary = isOutOfBoundary(boundary.maxLat, boundary.maxLon);
    }
    
    return outofboundary;
}
function pointArrayIsOutOfBoundary(point_array) {
    var boundary = getMinMaxBoundary(point_array);
    return boundaryIsOutOfBoundary(boundary);
    
}
function isOutOfBoundary(lat, lon) {
    if(!mmmap2) return false;
    if(isNumber(lat) && isNumber(lon)) {
        lat = parseFloat(lat);
        lon = parseFloat(lon);
        var bound = mapBoundary(mmmap2);
        if ( lat < bound.minLat || lat > bound.maxLat || lon < bound.minLon || lon > bound.maxLon ) {
            return true;
        }
    }
    return false;
}
function moveLocationWhenOutOfBoundary(lat, lon) {
    if(!mmmap2) return false;
    if(isNumber(lat) && isNumber(lon)) {
        if ( isOutOfBoundary(lat, lon) ) {
            moveLocation(lat, lon);
        }
    }
}
function showPopup(lat, lon, title, detail, op) {
    if(!mmmap2 || !longdo) return false;
    
    var popup_op = {title: title, detail: detail, autoFocus: true};
    
    if(op)
        popup_op = mergeObject(popup_op, op);
    
    var popup = new longdo.Popup(
        { lon: lon, lat: lat },
        popup_op
    );
    
    mmmap2.Overlays.add(popup);
}
function clearShape(shape) {
    mmmap2.Overlays.remove(shape);
}
function clearMarker(marker) {
    mmmap2.Overlays.remove(marker);
}
function clearPopup(popup) {
    mmmap2.Overlays.remove(popup);
}
function clearActivePopup() {
    clearPopup(getActivePopup());
}
function getShapeOption(linewidth, linecolor, fillcolor, title, detail, label, editable) {
    var op = {};
    if(typeof title != 'undefined') {
        op.title = title;
    }
    if(typeof detail != 'undefined') {
        op.detail = detail;
    }
    if(typeof label != 'undefined') {
        op.label = label;
    }
    if(typeof linewidth != 'undefined'){
        op.lineWidth = linewidth;
    }
    if(typeof linecolor != 'undefined'){
        op.lineColor = linecolor;
    }
    if(typeof fillcolor != 'undefined'){
        op.fillColor = fillcolor;
    }
    if(typeof editable != 'undefined'){
        op.editable = editable;
    }
    return op;
}
function cloneShape(shape, diffop, keep_ori_shape) {
    if(typeof diffop != 'undefined') {
        for(var property in diffop) {
          if(typeof property == "string" && property != "") {      
            shape[property] = diffop[property];
          }
        }
    }
    var obj = false;
    var shape_type = getShapeType(shape);
    
    var label = shape.editable && typeof(shape.editable) == 'object' ? true : shape.label;
    
    if(shape_type == 'polygon') {
        obj = drawPolygon(shape.location(), shape.lineWidth, shape.lineColor, shape.fillColor, shape.title, shape.detail, label, shape.editable);
    } else if(shape_type == 'line') {
        obj = drawLine(shape.location(), shape.lineWidth, shape.lineColor, shape.fillColor, shape.title, shape.detail, label, shape.editable);
    }
    
    if(typeof keep_ori_shape == 'undefined' || !keep_ori_shape) clearShape(shape);
    
    return obj;
}
function drawLine(points, linewidth, linecolor, fillcolor, title, detail, label, editable) {
    var line = new longdo.Polyline(points, getShapeOption(linewidth, linecolor, fillcolor, title, detail, label, editable));
    mmmap2.Overlays.add(line);
    return line;
}
function drawPolygon(points, linewidth, linecolor, fillcolor, title, detail, label, editable) {    
    var polygon = new longdo.Polygon(points, getShapeOption(linewidth, linecolor, fillcolor, title, detail, label, editable));
    mmmap2.Overlays.add(polygon);
    return polygon;
}

function isEnableRouting() {
    return (mmmap2 && typeof mmmap2.Route != 'undefined');
}

function addRouteDestination(lat, lon) {
    if (!mmmap2 || !mmmap2.Route) return false;
    
    mmmap2.Route.add({lat: lat, lon: lon});
}

function getAllRouteDestinations() {
    if(!mmmap2 || !mmmap2.Route || !mmmap2.Route.list || mmmap2.Route.list().length < 1) return new Array();
    return mmmap2.Route.list();
}

function getAllRoutePoints() {
    if (!mmmap2 || !mmmap2.Route) return false;

    var line = mmmap2.Route.exportRouteLine();
    
    if(!line) return false;
    
    var points = line.location();
    
    return points;
}

function zoomAllRoute(forcezoom) {
    var point_array = getAllRoutePoints();
    
    if(!point_array || point_array.length == 0) return;
    
    if(forcezoom || pointArrayIsOutOfBoundary(point_array)) {
        appropriateZoom(mmmap2, point_array);
    }
}

function polyLineToPointArray(polyLines){
	for(var y = 0; y < polyLines.length; y++){
		if(polyLines[y] != null && polyLines[y].location() != null){
			var returnPointArr = polyLines[y].location();
			break;
		}
	}
	for(var i = y+1; i < polyLines.length; i++){
		if(typeof polyLines[i] != "undefined" && polyLines[i].length > 0)
			returnPointArr = returnPointArr.concat(polyLines[i].location());
	}
	return returnPointArr;
}

function getMinMaxBoundary(mapObj, obj, boundary) {
    var lat, lon;
		if(obj == null){
			return false;
		}
    var num_points = obj.length;
    for(var  i=0; i<num_points; i++) {
        lat = parseFloat(obj[i].lat);
        lon = parseFloat(obj[i].lon);
        
        if(typeof(boundary) == 'undefined' || !boundary) {
            boundary = {maxLat: lat, minLat: lat, minLon: lon, maxLon: lon};
        } else {
            if(lat > boundary.maxLat) {
                boundary.maxLat = lat;
            }
            if(lat < boundary.minLat) {
                boundary.minLat = lat;
            }
            if(lon > boundary.maxLon) {
                boundary.maxLon = lon;
            }
            if(lon < boundary.minLon) {
                boundary.minLon = lon;
            }
        }
    }
    return boundary;
}

function appropriateZoom(mapObj, point_array) {
    if(point_array.length > 0) {
        mapBoundary(mapObj, getMinMaxBoundary(mapObj, point_array));
    }
}

function findAppropriateZone(point_array, boundary) {
    var num_pointarray = point_array.length;
    for(var  i=0; i<num_pointarray; i++) {
        boundary = getMinMaxBoundary(mmmap2, point_array[i], boundary);
    }
    return boundary;
}
                                    
function setRoutingType(routeType, state) {
    if (!mmmap2 || !mmmap2.Route) return;
    mmmap2.Route.enableRoute(longdo.RouteType[routeType], state);
}
                                    
function setRoutingMode(mode) {
    if (!mmmap2 || !mmmap2.Route) return;
    mmmap2.Route.mode(longdo.RouteMode[mode]);
}

function initRoutingType(routeType, state) {
    setRoutingType(routeType, state);
    if(routeType == 'All') {
        if(state) $('.routing-type-option').attr('checked', 'checked');
        else $('.routing-type-option').removeAttr('checked');
    } else {
        if(state) {
            $('#routing-type-'+routeType.toLowerCase()).attr('checked', 'checked');
        } else  {
            $('#routing-type-'+routeType.toLowerCase()).removeAttr('checked');
        }
    }
                                    
}
                                    
function initRoutingMode(mode) {
    setRoutingMode(mode);
    $('#routing-mode-'+mode.toLowerCase()).attr('checked', 'checked');
}

function setRoutingTypeByOption(obj) {
    setRoutingType(obj.value, obj.checked);
    searchMyRouting();
}
                                    
function setRoutingModeByOption(obj) {
    setRoutingMode(obj.value);
    searchMyRouting();
}
                                    
function getRoutingDestinationName() {
    var title = '';

    var longdomap_routing = mmmap2.Route._longdomap_routing;
    var num_destination = longdomap_routing.length;
    
    for(var i=0; i<num_destination; i++) {
        title += longdomap_routing[i].name + ' - ';
    }
    
    if(title == '') title = '-';
    else {
        title = title.replace(/ - $/g, '');
    }
    
    return title;
}

function exportRoutingToShape() {
    var geom = getAllRoutePoints();
    
    if(!geom || geom.length <= 1) return;

    /*
    var geom = new Array();
    var guides = mmmap2.Route.guide();
    var num_guide = guides.length;
    
    var guide, path, points, num_path, num_points;
    
    for (var i=0; i<num_guide; i++) {
        guide = guides[i];
        path = guide.path;
        num_path = path.length;
        for(var j=0; j<num_path; j++) {
            points = path[j].location();
            num_points = points.length;
            for(var k=0; k<num_points; k++) {
                if(j > 0 && k == 0) continue;
                geom.push(points[k]);
            }
        }
    }*/    

    var title = getRoutingDestinationName();

    /*
    var first_path = guides[0].path[0];
    var polyobj = drawLine(geom, first_path.lineWidth, first_path.lineColor, first_path.fillColor, "New Shape", "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;", title, true);
    */
    
    var polyobj = drawLine(geom, 5, "rgba(255,131,205,0.7)", false, "New Shape", "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;", title, true);
    
    polyobj.longdomapcloned = true
    var mmooi = addMMooi(mmmap2, polyobj);
    polyobj.longdomap = {ooi: mmooi};
    document.selectedOOI = mmooi;

    document.selectedOOI.setLineColor(getHexColorFromRGBA(polyobj.lineColor));
    document.selectedOOI.setLineOpacity(0.7);
    document.selectedOOI.setLineWidth(5);
    document.selectedOOI.setGeotype('Line');
    document.selectedOOI.setTitleTh(title);
    document.selectedOOI.setTitleEn(title);
    document.selectedOOI.setTitleJa(title);


    document.selectedOOI.lineobject = document.selectedShape;

    document.selectedOOI.displayPopup();

    mmmap2.Route.clear();
}

function clearAllPopup() {
    if(!mmmap2 || !mmmap2.Overlays || !mmmap2.Overlays.geometry) return false;
    var all_overlay = mmmap2.Overlays.list();
    var num_overlay = all_overlay.length;
    var obj;
    for(var i=0; i<num_overlay; i++) {
        obj = all_overlay[i];
        if(obj && obj instanceof longdo.Popup) {
            clearPopup(obj);
        }
    }
}
function clearAllTag() {
    if(!mmmap2) return false;
    mmmap2.Tags.clear();
}
function clearAllMarker() {
    if(!mmmap2) return false;
    var all_overlay = mmmap2.Overlays.list();
    var num_overlay = all_overlay.length;
    var obj;
    for(var i=0; i<num_overlay; i++) {
        obj = all_overlay[i];
        if(obj && obj instanceof longdo.Marker) {
            clearMarker(obj);
        }
    }
    //mmmap2.Overlays.clear();
}
function clearAllGeom() {
    if(!mmmap2 || !mmmap2.Overlays || !mmmap2.Overlays.geometry) return false;
    var all_overlay = mmmap2.Overlays.list();
    var num_overlay = all_overlay.length;
    var obj;
    for(var i=0; i<num_overlay; i++) {
        obj = all_overlay[i];
        if(obj && (obj instanceof longdo.Circle || obj instanceof longdo.Polycurve || obj instanceof longdo.Polygon || obj instanceof longdo.Polyline)) {
            clearShape(obj);
        }
    }
    //mmmap2.Overlays.clear();
}

function getShapeType(shape) {
    if(!longdo) return false;
    
    if(shape instanceof longdo.Polygon) {
        return 'polygon';
    } else if(shape instanceof longdo.Polyline) {
        return 'line';
    } else if(shape instanceof longdo.Circle) {
        return 'ellipse';
    }
    return false;
}

function removeOverlayType(param){
		mapOverlayList = mmmap2.Overlays.list();
		for(var i = 0; i < mapOverlayList.length; i++){
			if(mapOverlayList[i].overlayType == param){
				mmmap2.Overlays.remove(mapOverlayList[i]);
			}
		}
		return;
}

function appropriateZoomFromAllLines(map, allLines){
var allLinesLatLon = Array();
                for(var countLines = 0; countLines < allLines.length; countLines++){
					if(allLines[countLines].polylines != null){
                    for(var allPolyLinesInLine = 0; allPolyLinesInLine < allLines[countLines].polylines.length; allPolyLinesInLine++){
						if(allLines[countLines].polylines[allPolyLinesInLine] != null && allLines[countLines].polylines[allPolyLinesInLine].length > 0){
                        	allLinesLatLon = allLinesLatLon.concat(allLines[countLines].polylines[allPolyLinesInLine]);
						}
                    }
					}
                }
                appropriateZoom(map, allLinesLatLon);
}

function updateActivePopupContent(content, overlay) {
    if(overlay && overlay.popup && overlay.popup()) {
        overlay.popup().detail(content);
    } else {
        var popup_overlay = getActivePopup();
        if(popup_overlay) {
            popup_overlay.detail(content);
        }
    }
}

function getActivePopup() {
    if(mmmap2.Overlays && mmmap2.Overlays.list) {
        var overlay_list =  mmmap2.Overlays.list();
        if(overlay_list && overlay_list.length > 0) {
            for(var i=0; i<overlay_list.length; i++) {
                if(overlay_list[i] && overlay_list[i] instanceof longdo.Popup && overlay_list[i].active()) {
                    return overlay_list[i];
                }
            }
        }
    }
    return false;
}

function latLonToPixel(obj){
    mapLeftTop = {lat: mmmap2.bound().maxLat, lon: mmmap2.bound().minLon};
    mtPosition = longdo.Util.locationToPoint(mmmap2.projection(), mapLeftTop);
    position = longdo.Util.locationToPoint(mmmap2.projection(), obj);
	zoomLevel = mmmap2.zoom();
	
// 	diffPoint = (longdo.Util.locationToPoint(map.projection(), map.location()).x - longdo.Util.locationToPoint(map.projection(), { lon: map.bound().minLon, lat: map.bound().maxLat }).x) >> (map.projection().maxZoom - zoomLevel)
diffPoint = {x: (position.x - mtPosition.x) / Math.pow(2, (20-zoomLevel)), y: (position.y - mtPosition.y) / Math.pow(2, 20-zoomLevel)};
return diffPoint;
}