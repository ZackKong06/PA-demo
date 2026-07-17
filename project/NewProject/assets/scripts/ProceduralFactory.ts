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

interface TextureBinding {
    material: Material;
    property: string;
}

export class ProceduralFactory {
    private readonly materials = new Map<string, Material>();
    private readonly textures = new Map<string, Texture2D>();
    private readonly pendingTextureBindings = new Map<string, TextureBinding[]>();
    private readonly meshes = new Map<PrimitiveKind, Mesh>();
    private roadMaterial: Material | null = null;
    private roadTextureOffset = 0;
    private riverTextureOffset = 0;
    private readonly riverMaterials: Material[] = [];
    private readonly castleMaterials: Material[] = [];
    private playerMaterial: Material | null = null;
    private playerIdleTexture: Texture2D | null = null;
    private playerAnimationTexture: Texture2D | null = null;
    private readonly enemyMaterials = new Map<number, Material>();

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

    public createLitTexturedBox(
        name: string,
        parent: Node,
        position: Vec3,
        scale: Vec3,
        color: Color,
        texturePath: string,
        normalPath: string,
        tiling = new Vec4(1, 1, 0, 0),
        roughness = 0.88,
        normalStrength = 0.85,
    ): Node {
        const node = new Node(name);
        node.setParent(parent);
        node.setPosition(position);
        node.setScale(scale);
        const renderer = node.addComponent(MeshRenderer);
        renderer.mesh = this.getMesh('box');
        // Keep scene construction alive on render backends without the standard normal-map technique.
        try {
            renderer.setMaterial(
                this.getLitTexturedMaterial(texturePath, normalPath, color, tiling, roughness, normalStrength),
                0,
            );
        } catch (error) {
            console.warn(`Lit material unavailable for ${texturePath}; using albedo fallback`, error);
            renderer.setMaterial(this.getTexturedMaterial(texturePath, color, tiling, false), 0);
        }
        if (texturePath === 'textures/road_pavers') this.roadMaterial = renderer.getMaterial(0);
        if (texturePath === 'textures/mega_stone') {
            const castleMaterial = renderer.getMaterial(0);
            if (castleMaterial && !this.castleMaterials.includes(castleMaterial)) this.castleMaterials.push(castleMaterial);
        }
        return node;
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
            new Vec4(1, -1, 0, 1),
            false,
        );
    }

    public createRiverSegment(parent: Node, z: number): Node {
        const root = new Node('River Segment');
        root.setParent(parent);
        root.setPosition(0, 0, z);
        return root;
        for (const side of [-1, 1]) {
            this.createBox(
                'River Bed', root, new Vec3(side * 6.3, -0.17, 0), new Vec3(3.4, 0.08, 12), new Color(28, 91, 118),
            );
            const riverSurface =             this.createTexturedPrimitive(
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
            const riverMaterial = riverSurface.getComponent(MeshRenderer)?.getMaterial(0);
            if (riverMaterial && !this.riverMaterials.includes(riverMaterial)) this.riverMaterials.push(riverMaterial);
        }
        return root;
    }

    public createBloodSplash(parent: Node, position: Vec3, scale: Vec3): Node {
        return this.createTexturedPrimitive('quad', 'Blood Splash', parent, position, scale, Color.WHITE, 'textures/blood_splash', new Vec4(1, -1, 0, 1), true);
    }

    public createImpactQuad(name: string, parent: Node, position: Vec3, scale: Vec3): Node {
        return this.createTexturedPrimitive(
            'quad',
            name,
            parent,
            position,
            scale,
            new Color(255, 238, 185, 255),
            'textures/impact_flash_white',
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
        const playerVisual = this.createTexturedPrimitive(
            'quad',
            'Player Character',
            root,
            new Vec3(0, 0.82, -0.04),
            new Vec3(1.35, 1.55, 1),
            Color.WHITE,
            'textures/player_animation',
            new Vec4(1 / 9, -1 / 8, 0, 1),
            true,
        );
        this.playerMaterial = playerVisual.getComponent(MeshRenderer)?.getMaterial(0) ?? this.playerMaterial;
        resources.load('textures/player_animation/texture', Texture2D, (error, texture) => {
            if (!error && texture) this.playerAnimationTexture = texture;
        });
        resources.load('textures/player_idle/texture', Texture2D, (error, texture) => {
            if (!error && texture) this.playerIdleTexture = texture;
        });
        return root;
    }

    public updatePlayerAnimation(direction: number, elapsed: number): void {
        if (!this.playerMaterial) return;
        const movingLeft = direction < -0.05;
        const movingRight = direction > 0.05;
        if (!movingLeft && !movingRight && this.playerIdleTexture) {
            this.playerMaterial.setProperty('mainTexture', this.playerIdleTexture);
            this.playerMaterial.setProperty('tilingOffset', new Vec4(1, 1, 0, 0));
            return;
        }
        if (this.playerAnimationTexture) this.playerMaterial.setProperty('mainTexture', this.playerAnimationTexture);
        const frame = Math.floor(elapsed * 10) % 9;
        const row = movingLeft ? 4 : 3;
        const frameWidth = 1 / 9;
        const frameHeight = 1 / 8;
        this.playerMaterial.setProperty('tilingOffset', new Vec4(frameWidth, -frameHeight, frame * frameWidth, 1 - row * frameHeight));
    }

    public updateEnemyAnimation(elapsed: number): void {
        const frame = Math.floor(elapsed * 8) % 7;
        for (const [strength, material] of this.enemyMaterials) {
            const row = strength >= 3 ? 0 : strength === 2 ? 1 : 2;
            material.setProperty('tilingOffset', new Vec4(1 / 7, -1 / 6, frame / 7, 1 - row / 6));
        }
    }

    private getEnemyFrameTiling(strength: number): Vec4 {
        const frameWidth = 1 / 7;
        const frameHeight = 1 / 6;
        const column = 0;
        const row = 1;
        return new Vec4(frameWidth, -frameHeight, column * frameWidth, 1 - row * frameHeight);
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
        const enemyVisual = this.createTexturedPrimitive(
            'quad',
            'Enemy Character',
            root,
            new Vec3(0, 0.86, -0.04),
            new Vec3(1.7, 2, 1),
            textureTint,
            'textures/enemy_character_sheet',
            this.getEnemyFrameTiling(strength),
            true,
        );
        const enemyMaterial = enemyVisual.getComponent(MeshRenderer)?.getMaterial(0);
        if (enemyMaterial) this.enemyMaterials.set(strength, enemyMaterial);

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

    public updateRoadTextureScroll(distance: number): void {
        if (!this.roadMaterial) return;
        this.roadTextureOffset = (this.roadTextureOffset - distance / 8) % 1;
        this.roadMaterial.setProperty('tilingOffset', new Vec4(3, 6, 0, this.roadTextureOffset));
        this.riverTextureOffset = (this.riverTextureOffset - distance / 8) % 1;
        for (const riverMaterial of this.riverMaterials) {
            riverMaterial.setProperty('tilingOffset', new Vec4(2, 6, 0, this.riverTextureOffset));
        }
        for (const castleMaterial of this.castleMaterials) {
            castleMaterial.setProperty('tilingOffset', new Vec4(1, 4, 0, this.roadTextureOffset));
        }
    }

    public createRoadSegment(parent: Node, z: number): Node {
        const segment = new Node('RoadSegment');
        segment.setParent(parent);
        segment.setPosition(0, 0, z);
        this.createLitTexturedBox(
            'Road',
            segment,
            new Vec3(0, -0.12, 0),
            new Vec3(6.5, 0.2, 12),
            Color.WHITE,
            'textures/road_pavers',
            'textures/road_pavers_normal',
            new Vec4(3, 6, 0, 0),
            0.92,
            0.72,
        );
        const wallColor = new Color(62, 70, 78);
        const wallTop = new Color(96, 105, 114);
        this.createLitTexturedBox('Castle Wall L', segment, new Vec3(-3.38, 0.65, 0), new Vec3(0.42, 1.8, 12), new Color(92, 96, 102), 'textures/mega_stone', 'textures/mega_stone_normal', new Vec4(1, 4, 0, 0), 0.94, 1.0);
        this.createLitTexturedBox('Castle Wall R', segment, new Vec3(3.38, 0.65, 0), new Vec3(0.42, 1.8, 12), new Color(92, 96, 102), 'textures/mega_stone', 'textures/mega_stone_normal', new Vec4(1, 4, 0, 0), 0.94, 1.0);
        for (const side of [-1, 1]) {
            for (let battlement = -5; battlement <= 5; battlement++) {
                this.createLitTexturedBox('Castle Battlement', segment, new Vec3(side * 3.38, 1.95, battlement * 2.2), new Vec3(0.5, 0.32, 0.62), new Color(108, 112, 118), 'textures/mega_stone', 'textures/mega_stone_normal', new Vec4(0.5, 0.5, 0, 0), 0.94, 1.0);
            }
        }
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

    private getLitTexturedMaterial(
        texturePath: string,
        normalPath: string,
        color: Color,
        tiling: Vec4,
        roughness: number,
        normalStrength: number,
    ): Material {
        const key = `lit:${texturePath}:${normalPath}:${color.r}-${color.g}-${color.b}:${tiling.x}-${tiling.y}:${roughness}:${normalStrength}`;
        const cached = this.materials.get(key);
        if (cached) {
            return cached;
        }
        const material = new Material();
        material.initialize({
            effectName: 'builtin-standard',
            defines: { USE_ALBEDO_MAP: true, USE_NORMAL_MAP: true },
        });
        material.setProperty('mainColor', color);
        material.setProperty('tilingOffset', tiling);
        material.setProperty('roughness', roughness);
        material.setProperty('metallic', 0);
        material.setProperty('normalStrength', normalStrength);
        this.materials.set(key, material);
        this.attachTexture(material, texturePath, 'mainTexture');
        this.attachTexture(material, normalPath, 'normalMap');
        return material;
    }

    private attachTexture(material: Material, texturePath: string, property = 'mainTexture'): void {
        const texture = this.textures.get(texturePath);
        if (texture) {
            material.setProperty(property, texture);
            return;
        }

        const pending = this.pendingTextureBindings.get(texturePath);
        if (pending) {
            pending.push({ material, property });
            return;
        }

        this.pendingTextureBindings.set(texturePath, [{ material, property }]);
        resources.load(`${texturePath}/texture`, Texture2D, (error, loadedTexture) => {
            const waitingBindings = this.pendingTextureBindings.get(texturePath) ?? [];
            this.pendingTextureBindings.delete(texturePath);
            if (error || !loadedTexture) {
                console.warn(`Unable to load texture ${texturePath}`, error);
                return;
            }
            loadedTexture.setWrapMode(0 as any, 0 as any);
            this.textures.set(texturePath, loadedTexture);
            waitingBindings.forEach((binding) => binding.material.setProperty(binding.property, loadedTexture));
        });
    }

}
