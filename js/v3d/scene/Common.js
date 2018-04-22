
Object.assign(V3d.Scene, {

    DefaultSetup: function(container, sceneController, sceneRenderer, cameraController, setupParams){
        Cik.Input.Init(container);
        Cik.Input.camera = cameraController.camera;
		Cik.Input.onResize.push(sceneRenderer.ReconfigureViewport.bind(sceneRenderer));
        container.appendChild(sceneRenderer.renderer.domElement);
        sceneRenderer.UseCamera(cameraController.camera);

        var units = sceneController.params.units;

        // Camera move
		cameraController.position.x = 80 * units;
		cameraController.position.y = 40 * units;
        cameraController.position.z = 40 * units;

        // Fill lights
        this.DefaultLights(sceneController);

        // Env
        var gridHelper = new THREE.GridHelper(200 * units, 20);
        sceneController.AddDefault(gridHelper);

        var sky = new THREE.Sky();
        sky.scale.setScalar( 450000 );
        sceneController.AddDefault(sky);

        var distance = 400000;
        var effectController  = {
            turbidity: 10,
            rayleigh: 2,
            mieCoefficient: 0.005,
            mieDirectionalG: 0.8,
            luminance: 1,
            inclination: 0.49, // elevation / inclination
            azimuth: 0.25, // Facing front,
            sun: ! true
        };

        var guiChanged = function () {
            var uniforms = sky.material.uniforms;
            uniforms.turbidity.value = effectController.turbidity;
            uniforms.rayleigh.value = effectController.rayleigh;
            uniforms.luminance.value = effectController.luminance;
            uniforms.mieCoefficient.value = effectController.mieCoefficient;
            uniforms.mieDirectionalG.value = effectController.mieDirectionalG;

            var theta = Math.PI * ( effectController.inclination - 0.5 );
            var phi = 2 * Math.PI * ( effectController.azimuth - 0.5 );

            var sunPosition = new THREE.Vector3();
            sunPosition.x = distance * Math.cos( phi );
            sunPosition.y = distance * Math.sin( phi ) * Math.sin( theta );
            sunPosition.z = distance * Math.sin( phi ) * Math.cos( theta );

            uniforms.sunPosition.value.copy( sunPosition );
        };

        Cik.Config.TrackLoadEdit('sun', effectController, guiChanged, 
            'turbidity', 'rayleigh', 'luminance', 'mieCoefficient', 'mieDirectionalG', 'inclination', 'azimuth'
        );

        for(var i = 0; i < 10; i++){
            var cube = new THREE.Mesh(
                new THREE.CubeGeometry(),
                new THREE.MeshBasicMaterial()
            );
            var a = i / 10 * Math.PI * 2;
            var d = 10;
            cube.position.set(
                Math.cos(a) * d,
                0,
                Math.sin(a) * d
            );
            sceneController.AddDefault(cube);
        }
        
        // Stats
        if(setupParams.stats) this.Stats(container);
    },

    DefaultLights: function(sceneController){

        var units = sceneController.params.units;

        var ambient = new THREE.AmbientLight( 0x404040 );

        var directionalLight = new THREE.DirectionalLight(0xfeeedd);
        directionalLight.position.set(7 * units, 15 * units, 30 * units);
    /*
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = .5 * units;
        directionalLight.shadow.camera.far = 100 * units;
        directionalLight.shadow.camera.bottom = directionalLight.shadow.camera.left = -50 * units;
        directionalLight.shadow.camera.top = directionalLight.shadow.camera.right = 50 * units;
        directionalLight.shadow.camera.updateProjectionMatrix();
        
        var shadowCamerHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
        sceneController.ambientContainer.add(shadowCamerHelper);*/
        
        sceneController.ambientContainer.add(ambient);
        sceneController.ambientContainer.add(directionalLight);
    },

    Stats: function(container){
        if(this.stats !== undefined) return;
        
        this.stats = new Stats();
        container.appendChild(this.stats.dom);
        this.stats.dom.style.margin = '20px';
    }

});