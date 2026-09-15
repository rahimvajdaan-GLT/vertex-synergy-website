# 3D Model Assets

Drop real GLB/GLTF files into this folder to populate the scroll stages. The site loads each file dynamically with Three.js (GLTFLoader + DRACOLoader, HDR environment, PBR materials, contact shadows).

Expected files (one per scroll stage):

| Slot | File | Stage |
|------|------|-------|
| Main Building | `/models/main-building.glb` | 1 — Complete low-rise |
| Structural Frame | `/models/structure.glb` | 2 — Reveal structure |
| MEP Services | `/models/mep-services.glb` | 3 — Reveal services |
| Façade Assembly | `/models/facade.glb` | 4 — Exploded façade |
| Interior Fit-out | `/models/interior.glb` | 5 — Move inside |
| Construction Equipment | `/models/crane.glb` | 6 — Rotate equipment |
| Completed Building | `/models/completed-building.glb` | 7 — Reassemble |

Notes:
- Use detailed architectural/arch-viz models (not low-poly blocks). Max ~5 floors for the main building.
- Draco-compressed GLB is supported (decoder loaded from CDN).
- Models are auto-normalized to a consistent scale and centered on the ground plane.
- You can also upload models from the admin panel at `/models` (stored in the ModelAsset entity and used in place of these files).
- Until a file is present, that stage shows a "3D model asset required — upload GLB/GLTF file." placeholder instead of placeholder geometry.
