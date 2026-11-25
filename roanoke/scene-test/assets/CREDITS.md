# Asset credits and licences (check before publishing / monetising)

| File | Source | Licence |
|---|---|---|
| Soldier.glb | three.js examples (`examples/models/gltf/Soldier.glb`); character/animations originate from Mixamo | **Not verified.** Mixamo has its own Adobe terms. Check them before monetising |
| CesiumMan.glb | Khronos glTF-Sample-Assets, (c) 2017 Cesium | CC BY 4.0, **credit required**: "Cesium Man by Cesium, CC BY 4.0" |

Quaternius packs (CC0) were the preferred source but Google Drive returned "Quota exceeded" when tested; retry later.

## Fetch the models (they are not committed to git)

```bash
cd roanoke/scene-test/assets
curl -L -o Soldier.glb   https://cdn.jsdelivr.net/gh/mrdoob/three.js@r170/examples/models/gltf/Soldier.glb
curl -L -o CesiumMan.glb https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumMan/glTF-Binary/CesiumMan.glb
```
