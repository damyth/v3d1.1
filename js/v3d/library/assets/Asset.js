
V3d.Library.Asset = function(sov, object){
    this.sov = sov;
    this.view = object;
};

Object.assign(V3d.Library.Asset.prototype, {


});


Object.assign(V3d.Library.Asset, {

    DUMMY_PREFIX: 'dummy_',

    loader: new THREE.ObjectLoader(),

    RecoverTextures: function(view){
        var dummyPrefix = this.DUMMY_PREFIX;
        var mapsURL = location.href.indexOf('backend') !== -1 ? '../assets/Project/maps/' : 'assets/Project/maps/';

        view.traverse(function(child){
            if(child instanceof THREE.Mesh){
                var material = child.material;
                var keys = Object.keys(material);
                keys.forEach(key => {
                    if(material[key] instanceof THREE.Texture){
                        var texture = material[key];
                        var id = texture.uuid;
                        var dummyIndex = id.indexOf(dummyPrefix);
                        if(dummyIndex !== -1){
                            texture.uuid = id.substring(dummyIndex + dummyPrefix.length);
                            var imageName = texture.name;
                            var loader = new THREE.ImageLoader();
                            var imageURL = mapsURL + imageName;
                            loader.load(imageURL, function(result){
                                texture.image = result;
                                texture.needsUpdate = true;
                            });
                        }
                    }
                });
            }
        });
    },

    FromJSON: function(data){
        var sov = (typeof data.sov === 'string') ? V3d.SOV.FromJSON(data.sov) : data.sov;
        var view = this.ViewFromJSON(data.view);
        var asset = new V3d.Library.Asset(sov, view);
        return asset;
    },

    ViewFromJSON: function(data){
        var view = this.loader.parse(data);
        this.RecoverTextures(view);
        return view;
    }
});