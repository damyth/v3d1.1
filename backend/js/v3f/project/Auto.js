
V3f.Auto = {

    GetDefaultCamera: function(){
        return V3d.app.cameraController.camera;
    },

    GetDefaultDomElement: function(){
        return V3d.app.sceneRenderer.renderer.domElement;
    },

    GetDefaultScene: function(){
        return V3d.app.sceneController.scene;
    },

    GetDefaultSceneController: function(){
        return V3d.app.sceneController;
    },
    
    LoadGLTF: function(nameOnly){
        var gltfPath = V3d.Ressources.Temp('archives') + nameOnly + '/' + nameOnly + '.gltf';
        V3f.Project.Library.LoadGLTFFile(gltfPath);
    },

    smartGroupCount: 0,
    MakeSmart: function(meshes){

        var smartMeshes = [];
        meshes.forEach(mesh => {
            var smart = new V3f.Smart.Mesh(mesh);
            smartMeshes.push(smart);
        });

        var smartRaycastGroup = new Cik.Input.RaycastGroup(smartMeshes, 
            function(smartMesh){
                smartMesh.Show();
                if(Cik.Input.keys['ctrl']){
                    if(smartMesh.target.asset !== undefined) smartMesh.target.asset.Smart();
                }
            }, 
            function(smartMesh){
                return smartMesh.target;
            }, 
            false, // updateProperty, 
            false, // recursive, 
            false, // continuous
        );

        Cik.Input.AddRaycastGroup('OnClick', 'Smart.Group' + (V3f.Auto.smartGroupCount ++), smartRaycastGroup);
    },

    DisplayRow: function(objects){
        var container = new THREE.Object3D();
        var box3 = new THREE.Box3();
        var vec3 = new THREE.Vector3();
        var slider = 0;
        for(var i = 0; i < objects.length; i++){
            var object = objects[i];

            box3.setFromObject(object);

            box3.getCenter(vec3);
            object.position.sub(vec3);

            box3.getSize(vec3);
            object.position.y += vec3.y * .5;

            object.position.x += slider + vec3.x * .5;
            slider += vec3.x * 1.1;

            container.add(object);
        }

        return container;
    },

    SmartDisplay: function(objects){
        var sceneController = V3d.app.sceneController;
        
        var row = V3f.Auto.DisplayRow(objects);
        sceneController.Add(row);

        var meshes = [];
        objects.forEach(object => {
            object.traverse(function(child){
                if(child instanceof THREE.Mesh){
                    meshes.push(child);
                }
            });
        });

        V3f.Auto.MakeSmart(meshes);
    }
};