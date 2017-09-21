			var container;
			var camera, scene, renderer, mesh;
			var uniforms;
			var defaultAttributeValues;
			init();
			animate();

			function init() {

				container = document.getElementById( 'container' );

				camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );

				camera.position.z = 200;
				camera.position.x = 10;

				scene = new THREE.Scene();

				var geometry = new THREE.SphereGeometry( 100, 50, 60 );

				var material = new THREE.MeshBasicMaterial({
					color:0xffff00,
					wireframe:true
				});
				mesh = new THREE.Mesh( geometry, material );
				scene.add( mesh );

				// 绘制飞线
				var start = [{"lat":22.33,"lng":114.18},{"lat":37.8963349,"lng":-4.3810863},{"lat":37.8963349,"lng":-4.3810863}];
				var end = [{"lat":36.902,"lng":-117.708},{"lat":37.8963349,"lng":-88.62},{"lat":28.6,"lng":107.15}];
				var mid = [{"lat":11,"lng":55},{"lat":20,"lng":-50},{"lat":32,"lng":51}];
				// 经纬度转坐标
				var xyzStart = latlngToXYZ(start,110);
				var xyzMid = latlngToXYZ(mid,110);
				var xyzEnd = latlngToXYZ(end,110);

				var threeStart = new THREE.Vector3(xyzStart[0].x,xyzStart[0].y,xyzStart[0].z);
				var threeMid = new THREE.Vector3(xyzMid[0].x,xyzMid[0].y,xyzMid[0].z);
				var threeEnd = new THREE.Vector3(xyzEnd[0].x,xyzEnd[0].y,xyzEnd[0].z);

				var threeStart1 = new THREE.Vector3(xyzStart[1].x,xyzStart[1].y,xyzStart[1].z);
				var threeMid1 = new THREE.Vector3(xyzMid[1].x,xyzMid[1].y,xyzMid[1].z);
				var threeEnd1 = new THREE.Vector3(xyzEnd[1].x,xyzEnd[1].y,xyzEnd[1].z);

				var threeStart2 = new THREE.Vector3(xyzStart[2].x,xyzStart[2].y,xyzStart[2].z);
				var threeMid2 = new THREE.Vector3(xyzMid[2].x,xyzMid[2].y,xyzMid[2].z);
				var threeEnd2 = new THREE.Vector3(xyzEnd[2].x,xyzEnd[2].y,xyzEnd[2].z);

				var curve1 = new THREE.SplineCurve3([threeStart1,threeMid1,threeEnd1])
				var curve2 = new THREE.SplineCurve3([threeStart2,threeMid2,threeEnd2])
				var curve3 = new THREE.SplineCurve3([threeStart,threeMid,threeEnd])
				var tubeGeometry = new THREE.TubeGeometry(curve3,100,3,3,false);
				var tubeGeometry1 = new THREE.TubeGeometry(curve1,100,3,3,false);
				var tubeGeometry2 = new THREE.TubeGeometry(curve2,100,3,3,false);
				var tubeMaterial = new THREE.MeshBasicMaterial({
					color:0xff0000
				});

				uniforms = {
						time:{
							type:"f",
							value:0.1
						}
				}
				defaultAttributeValues = {
					'color': [ 1, 0.4, 1 ]
				}
				var tubeShaderMaterial = new THREE.ShaderMaterial({
					uniforms:uniforms,
					defaultAttributeValues:defaultAttributeValues,
					vertexShader:document.getElementById("vertexShader").textContent,
					fragmentShader:document.getElementById("fragmentShader").textContent,
					transparent:true,
					// alphaTest:0.5
				});
				var tubeMesh = new THREE.Mesh(tubeGeometry,tubeShaderMaterial)
				var tubeMesh1 = new THREE.Mesh(tubeGeometry1,tubeShaderMaterial)
				var tubeMesh2 = new THREE.Mesh(tubeGeometry2,tubeShaderMaterial)
				scene.add(tubeMesh,tubeMesh2,tubeMesh1)

				var paricleGeometry = new THREE.Geometry();

				// 经纬度转x,y,z坐标
				function latlngToXYZ ( coord,radius ){
					var sphereArray = [];
					var radius = radius||10;
					for(var i = 0; i < coord.length; i++) {
					    var lat = coord[i].lat;
					    var lon = coord[i].lng;
					    var subRadius = Math.cos(lat * Math.PI / 180) * radius;
					    var posX = (subRadius * Math.cos(lon * Math.PI / 180) );
					    var posY = (subRadius * Math.sin(lon * Math.PI / 180) );
					    var posZ = (Math.sin(lat * Math.PI / 180) * radius);
					    sphereArray.push({x:posX,y:posY,z:posZ})
					}
					return sphereArray;
				}
				// 绘制世界地图
				var getWorldXYZ = getMapData(100);
				var geometryPar = new THREE.Geometry();
				var materialPar = new THREE.PointsMaterial( { size: 1 ,color:0x00ff00} );
				for (var i = 0; i < getWorldXYZ.length; i++) {
					var vertex = new THREE.Vector3(getWorldXYZ[i].x,getWorldXYZ[i].y,getWorldXYZ[i].z)
					geometryPar.vertices.push( vertex )
				}

				var particle = new THREE.Points( geometryPar,materialPar );
				scene.add(particle)

				renderer = new THREE.WebGLRenderer();
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );
			}
			function getMapData(radius){
				var mapArr = mapData.RECORDS
				var newArr = []
				var showXYZArray = [];
				var radius = radius||10;
				for(var i in mapArr){
					if(mapArr[i].xy){
						newArr = mapArr[i].xy.split(",");
					}
					for(var j in newArr){
						var lon = newArr[0];
						var lat = newArr[1];
						var subRadius = Math.cos(lat * Math.PI / 180) * radius;
						var posX = (subRadius * Math.cos(lon * Math.PI / 180) );
						var posY = (subRadius * Math.sin(lon * Math.PI / 180) );
						var posZ = (Math.sin(lat * Math.PI / 180) * radius);
						showXYZArray.push({x:posX,y:posY,z:posZ})
					}
				}
				return showXYZArray
			}
			function animate() {
				requestAnimationFrame( animate );
				render();
			}

			function render() {
				renderer.render( scene, camera );
				scene.rotation.z+=0.01;
				scene.rotation.x+=0.01;
				uniforms.time.value += 0.1
			}
