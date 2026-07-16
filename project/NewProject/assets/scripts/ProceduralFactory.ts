import {
    Color,
    Material,
    Mesh,
    MeshRenderer,
    Node,
    primitives,
    utils,
    Vec3,
} from 'cc';

type PrimitiveKind = 'box' | 'sphere' | 'cylinder' | 'cone';

export class ProceduralFactory {
    private readonly materials = new Map<string, Material>();
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

        this.createBox('Body', root, new Vec3(0, 0.72, 0), new Vec3(0.42, 0.62, 0.28), color);
        this.createSphere('Head', root, new Vec3(0, 1.32, 0), new Vec3(0.38, 0.38, 0.38), new Color(255, 213, 174));
        this.createBox('LegL', root, new Vec3(-0.12, 0.25, 0), new Vec3(0.15, 0.45, 0.18), new Color(34, 55, 70));
        this.createBox('LegR', root, new Vec3(0.12, 0.25, 0), new Vec3(0.15, 0.45, 0.18), new Color(34, 55, 70));

        this.createBox('Visor', root, new Vec3(0, 1.34, -0.18), new Vec3(0.34, 0.12, 0.05), new Color(82, 234, 255));
        return root;
    }

    public createEnemy(name: string, parent: Node, strength = 1): Node {
        const root = new Node(name);
        root.setParent(parent);
        const bodyColor = strength === 3
            ? new Color(59, 183, 103)
            : strength === 2 ? new Color(132, 68, 196) : new Color(221, 69, 79);
        const darkColor = strength === 3
            ? new Color(30, 91, 59)
            : strength === 2 ? new Color(57, 34, 88) : new Color(82, 36, 41);
        const baseColor = strength === 5
            ? new Color(255, 67, 75)
            : strength === 3 ? new Color(181, 84, 245)
                : strength === 2 ? new Color(70, 155, 255) : new Color(67, 224, 125);
        this.createCylinder('Enemy Base', root, new Vec3(0, 0.025, 0), new Vec3(0.78, 0.04, 0.78), baseColor);

        this.createBox('Body', root, new Vec3(0, 0.72, 0), new Vec3(0.5, 0.68, 0.36), bodyColor);
        this.createSphere('Head', root, new Vec3(0, 1.34, 0), new Vec3(0.44, 0.44, 0.44), bodyColor);
        this.createBox('LegL', root, new Vec3(-0.14, 0.25, 0), new Vec3(0.17, 0.46, 0.2), darkColor);
        this.createBox('LegR', root, new Vec3(0.14, 0.25, 0), new Vec3(0.17, 0.46, 0.2), darkColor);
        this.createSphere('EyeL', root, new Vec3(-0.12, 1.38, -0.2), new Vec3(0.09, 0.09, 0.06), new Color(255, 238, 103));
        this.createSphere('EyeR', root, new Vec3(0.12, 1.38, -0.2), new Vec3(0.09, 0.09, 0.06), new Color(255, 238, 103));

        if (strength >= 2) {
            const armorColor = new Color(247, 198, 74);
            const hornL = this.createCone('HornL', root, new Vec3(-0.28, 1.72, 0), new Vec3(0.18, 0.5, 0.18), armorColor);
            const hornR = this.createCone('HornR', root, new Vec3(0.28, 1.72, 0), new Vec3(0.18, 0.5, 0.18), armorColor);
            hornL.setRotationFromEuler(0, 0, 18);
            hornR.setRotationFromEuler(0, 0, -18);
            this.createBox('Chest Armor', root, new Vec3(0, 0.9, -0.24), new Vec3(0.75, 0.38, 0.12), armorColor);
            this.createBox('ShoulderL', root, new Vec3(-0.42, 0.98, 0), new Vec3(0.28, 0.24, 0.48), armorColor);
            this.createBox('ShoulderR', root, new Vec3(0.42, 0.98, 0), new Vec3(0.28, 0.24, 0.48), armorColor);
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
        this.createBox(
            'Road',
            segment,
            new Vec3(0, -0.12, 0),
            new Vec3(6.5, 0.2, 12),
            new Color(60, 72, 82),
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

}
