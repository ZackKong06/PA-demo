import {
    Color,
    Material,
    Mesh,
    MeshRenderer,
    Node,
    primitives,
    resources,
    Texture2D,
    utils,
    Vec3,
    Vec4,
} from 'cc';

type PrimitiveKind = 'box' | 'sphere' | 'cylinder' | 'cone' | 'quad';

export class ProceduralFactory {
    private readonly materials = new Map<string, Material>();
    private readonly textures = new Map<string, Texture2D>();
    private readonly pendingTextureMaterials = new Map<string, Material[]>();
    private readonly meshes = new Map<PrimitiveKind, Mesh>();

    public createBox(
        name: string,
        parent: Node,
        position: Vec3,
        scale: Vec3,
        color: Color,
    ): Node {
        return this.createPrimitive('box', name, parent, position, scale, color);
    }

    public createTexturedBox(
        name: string,
        parent: Node,
        position: Vec3,
        scale: Vec3,
        color: Color,
        texturePath: string,
        tiling = new Vec4(1, 1, 0, 0),
    ): Node {
        return this.createTexturedPrimitive('box', name, parent, position, scale, color, texturePath, tiling, false);
    }

    public createTexturedSphere(
        name: string,
        parent: Node,
        position: Vec3,
        scale: Vec3,
        color: Color,
        texturePath: string,
    ): Node {
        return this.createTexturedPrimitive(
            'sphere', name, parent, position, scale, color, texturePath, new Vec4(1, 1, 0, 0), false,
        );
    }

    public createTexturedCylinder(
        name: string,
        parent: Node,
        position: Vec3,
        scale: Vec3,
        color: Color,
        texturePath: string,
    ): Node {
        return this.createTexturedPrimitive(
            'cylinder', name, parent, position, scale, color, texturePath, new Vec4(1, 1, 0, 0), false,
        );
    }

    public createBackgroundQuad(parent: Node): Node {
        return this.createTexturedPrimitive(
            'quad',
            'Mountain Background',
            parent,
            new Vec3(0, 11, -72),
            new Vec3(55, 26, 1),
            Color.WHITE,
            'textures/mountain_background',
            new Vec4(1, 1, 0, 0),
            false,
        );
    }

    public createRiverSegment(parent: Node, z: number): Node {
        const root = new Node('River Segment');
        root.setParent(parent);
        root.setPosition(0, 0, z);
        for (const side of [-1, 1]) {
            this.createBox(
                'River Bed', root, new Vec3(side * 6.3, -0.17, 0), new Vec3(3.4, 0.08, 12), new Color(28, 91, 118),
            );
            this.createTexturedPrimitive(
                'box',
                'River Surface',
                root,
                new Vec3(side * 6.3, -0.1, 0),
                new Vec3(3.35, 0.035, 12),
                new Color(98, 210, 235, 205),
                'textures/river_water',
                new Vec4(2, 6, 0, 0),
                true,
            );
        }
        return root;
    }

    public createImpactQuad(name: string, parent: Node, position: Vec3, scale: Vec3): Node {
        return this.createTexturedPrimitive(
            'quad',
            name,
            parent,
            position,
            scale,
            new Color(255, 238, 185, 255),
            'textures/impact_flash',
            new Vec4(1, 1, 0, 0),
            true,
        );
    }

    public createSphere(
        name: string,
        parent: Node,
        position: Vec3,
        scale: Vec3,
        color: Color,
    ): Node {
        return this.createPrimitive('sphere', name, parent, position, scale, color);
    }

    public createCylinder(
        name: string,
        parent: Node,
        position: Vec3,
        scale: Vec3,
        color: Color,
    ): Node {
        return this.createPrimitive('cylinder', name, parent, position, scale, color);
    }

    public createCone(
        name: string,
        parent: Node,
        position: Vec3,
        scale: Vec3,
        color: Color,
    ): Node {
        return this.createPrimitive('cone', name, parent, position, scale, color);
    }

    public createSoldier(name: string, parent: Node, color: Color): Node {
        const root = new Node(name);
        root.setParent(parent);
        this.createCylinder('Player Base', root, new Vec3(0, 0.025, 0.08), new Vec3(0.62, 0.035, 0.48), color);
        this.createTexturedPrimitive(
            'quad',
            'Player Character',
            root,
            new Vec3(0, 0.82, -0.04),
            new Vec3(1.35, 1.55, 1),
            Color.WHITE,
            'textures/player_character',
            new Vec4(1, -1, 0, 1),
            true,
        );
        return root;
    }

    public createEnemy(name: string, parent: Node, strength = 1): Node {
        const root = new Node(name);
        root.setParent(parent);
        const baseColor = strength === 5
            ? new Color(255, 67, 75)
            : strength === 3 ? new Color(181, 84, 245)
                : strength === 2 ? new Color(70, 155, 255) : new Color(67, 224, 125);
        this.createCylinder('Enemy Base', root, new Vec3(0, 0.025, 0), new Vec3(0.78, 0.04, 0.78), baseColor);

        const textureTint = strength === 5
            ? new Color(255, 145, 145)
            : strength === 3 ? new Color(170, 255, 196)
                : strength === 2 ? new Color(214, 182, 255) : Color.WHITE;
        this.createTexturedPrimitive(
            'quad',
            'Enemy Character',
            root,
            new Vec3(0, 0.86, -0.04),
            new Vec3(1.7, 2, 1),
            textureTint,
            'textures/enemy_character',
            new Vec4(1, -1, 0, 1),
            true,
        );

        if (strength >= 2) {
            const armorColor = new Color(247, 198, 74);
            const hornL = this.createCone('HornL', root, new Vec3(-0.28, 1.72, 0), new Vec3(0.18, 0.5, 0.18), armorColor);
            const hornR = this.createCone('HornR', root, new Vec3(0.28, 1.72, 0), new Vec3(0.18, 0.5, 0.18), armorColor);
            hornL.setRotationFromEuler(0, 0, 18);
            hornR.setRotationFromEuler(0, 0, -18);

            if (strength === 5) {
                this.createBox('Boss Crown', root, new Vec3(0, 1.92, -0.08), new Vec3(0.82, 0.28, 0.42), new Color(255, 65, 72));
                this.createSphere('Boss Core', root, new Vec3(0, 0.92, -0.35), new Vec3(0.25, 0.25, 0.12), new Color(255, 238, 112));
                root.setScale(5.4, 5.4, 5.4);
            } else if (strength === 3) {
                this.createBox('Brute Crest', root, new Vec3(0, 1.78, -0.12), new Vec3(0.42, 0.32, 0.3), new Color(181, 84, 245));
                this.createSphere('Brute Core', root, new Vec3(0, 0.92, -0.34), new Vec3(0.22, 0.22, 0.12), new Color(220, 139, 255));
                root.setScale(2.3, 2.3, 2.3);
            } else {
                root.setScale(1.75, 1.75, 1.75);
            }
        }
        return root;
    }

    public createRoadSegment(parent: Node, z: number): Node {
        const segment = new Node('RoadSegment');
        segment.setParent(parent);
        segment.setPosition(0, 0, z);
        this.createTexturedBox(
            'Road',
            segment,
            new Vec3(0, -0.12, 0),
            new Vec3(6.5, 0.2, 12),
            new Color(168, 178, 184),
            'textures/road_stone',
            new Vec4(3, 6, 0, 0),
        );
        this.createBox('RailL', segment, new Vec3(-3.35, 0.42, 0), new Vec3(0.18, 0.7, 12), new Color(48, 196, 186));
        this.createBox('RailR', segment, new Vec3(3.35, 0.42, 0), new Vec3(0.18, 0.7, 12), new Color(48, 196, 186));
        return segment;
    }

    public createRoadStripe(parent: Node, z: number): Node {
        return this.createBox(
            'Stripe',
            parent,
            new Vec3(0, 0.02, z),
            new Vec3(0.1, 0.025, 1.2),
            new Color(231, 238, 224),
        );
    }

    private createPrimitive(
        kind: PrimitiveKind,
        name: string,
        parent: Node,
        position: Vec3,
        scale: Vec3,
        color: Color,
    ): Node {
        const node = new Node(name);
        node.setParent(parent);
        node.setPosition(position);
        node.setScale(scale);

        const renderer = node.addComponent(MeshRenderer);
        renderer.mesh = this.getMesh(kind);
        renderer.setMaterial(this.getMaterial(color), 0);
        return node;
    }

    private createTexturedPrimitive(
        kind: PrimitiveKind,
        name: string,
        parent: Node,
        position: Vec3,
        scale: Vec3,
        color: Color,
        texturePath: string,
        tiling: Vec4,
        transparent: boolean,
    ): Node {
        const node = new Node(name);
        node.setParent(parent);
        node.setPosition(position);
        node.setScale(scale);

        const renderer = node.addComponent(MeshRenderer);
        renderer.mesh = this.getMesh(kind);
        renderer.setMaterial(this.getTexturedMaterial(texturePath, color, tiling, transparent), 0);
        return node;
    }

    private getMesh(kind: PrimitiveKind): Mesh {
        const cached = this.meshes.get(kind);
        if (cached) {
            return cached;
        }

        let geometry;
        switch (kind) {
            case 'sphere':
                geometry = primitives.sphere(0.5, { segments: 12 });
                break;
            case 'cylinder':
                geometry = primitives.cylinder(0.5, 0.5, 1, { radialSegments: 12 });
                break;
            case 'cone':
                geometry = primitives.cylinder(0, 0.5, 1, { radialSegments: 12 });
                break;
            case 'quad':
                geometry = primitives.quad();
                break;
            default:
                geometry = primitives.box({ width: 1, height: 1, length: 1 });
                break;
        }

        const mesh = utils.createMesh(geometry);
        this.meshes.set(kind, mesh);
        return mesh;
    }

    private getMaterial(color: Color): Material {
        const key = `${color.r}-${color.g}-${color.b}-${color.a}`;
        const cached = this.materials.get(key);
        if (cached) {
            return cached;
        }

        const material = new Material();
        material.initialize({ effectName: 'builtin-unlit' });
        material.setProperty('mainColor', color);
        this.materials.set(key, material);
        return material;
    }

    private getTexturedMaterial(texturePath: string, color: Color, tiling: Vec4, transparent: boolean): Material {
        const key = `texture:${texturePath}:${color.r}-${color.g}-${color.b}-${color.a}:${tiling.x}-${tiling.y}:${transparent}`;
        const cached = this.materials.get(key);
        if (cached) {
            return cached;
        }

        const material = new Material();
        material.initialize({
            effectName: 'builtin-unlit',
            technique: transparent ? 1 : 0,
            defines: { USE_TEXTURE: true, USE_ALPHA_TEST: transparent },
        });
        material.setProperty('mainColor', color);
        material.setProperty('tilingOffset', tiling);
        if (transparent) {
            material.setProperty('alphaThreshold', 0.025);
            material.overridePipelineStates({ rasterizerState: { cullMode: 0 } });
        }
        this.materials.set(key, material);
        this.attachTexture(material, texturePath);
        return material;
    }

    private attachTexture(material: Material, texturePath: string): void {
        const texture = this.textures.get(texturePath);
        if (texture) {
            material.setProperty('mainTexture', texture);
            return;
        }

        const pending = this.pendingTextureMaterials.get(texturePath);
        if (pending) {
            pending.push(material);
            return;
        }

        this.pendingTextureMaterials.set(texturePath, [material]);
        resources.load(`${texturePath}/texture`, Texture2D, (error, loadedTexture) => {
            const waitingMaterials = this.pendingTextureMaterials.get(texturePath) ?? [];
            this.pendingTextureMaterials.delete(texturePath);
            if (error || !loadedTexture) {
                console.warn(`Unable to load texture ${texturePath}`, error);
                return;
            }
            loadedTexture.setWrapMode(0 as any, 0 as any);
            this.textures.set(texturePath, loadedTexture);
            waitingMaterials.forEach((waitingMaterial) => waitingMaterial.setProperty('mainTexture', loadedTexture));
        });
    }

}
