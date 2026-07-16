System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Button, Camera, Canvas, Color, Component, director, Graphics, HorizontalTextAlignment, input, Input, Label, Layers, Node, ResolutionPolicy, tween, UITransform, Vec3, VerticalTextAlignment, view, ProceduralFactory, _dec, _class, _crd, ccclass, GameState, PADemo;

  function _reportPossibleCrUseOfProceduralFactory(extras) {
    _reporterNs.report("ProceduralFactory", "./ProceduralFactory", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Button = _cc.Button;
      Camera = _cc.Camera;
      Canvas = _cc.Canvas;
      Color = _cc.Color;
      Component = _cc.Component;
      director = _cc.director;
      Graphics = _cc.Graphics;
      HorizontalTextAlignment = _cc.HorizontalTextAlignment;
      input = _cc.input;
      Input = _cc.Input;
      Label = _cc.Label;
      Layers = _cc.Layers;
      Node = _cc.Node;
      ResolutionPolicy = _cc.ResolutionPolicy;
      tween = _cc.tween;
      UITransform = _cc.UITransform;
      Vec3 = _cc.Vec3;
      VerticalTextAlignment = _cc.VerticalTextAlignment;
      view = _cc.view;
    }, function (_unresolved_2) {
      ProceduralFactory = _unresolved_2.ProceduralFactory;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7568fCab2lLOpUrLIEbbjtP", "PADemo", undefined);

      __checkObsolete__(['_decorator', 'Button', 'Camera', 'Canvas', 'Color', 'Component', 'director', 'EventMouse', 'EventTouch', 'Graphics', 'HorizontalTextAlignment', 'input', 'Input', 'Label', 'Layers', 'Node', 'ResolutionPolicy', 'tween', 'UITransform', 'Vec3', 'VerticalTextAlignment', 'view']);

      ({
        ccclass
      } = _decorator);

      GameState = /*#__PURE__*/function (GameState) {
        GameState[GameState["READY"] = 0] = "READY";
        GameState[GameState["PLAYING"] = 1] = "PLAYING";
        GameState[GameState["WIN"] = 2] = "WIN";
        GameState[GameState["LOSE"] = 3] = "LOSE";
        return GameState;
      }(GameState || {});

      _export("PADemo", PADemo = (_dec = ccclass('PADemo'), _dec(_class = class PADemo extends Component {
        constructor(...args) {
          super(...args);
          this.factory = new (_crd && ProceduralFactory === void 0 ? (_reportPossibleCrUseOfProceduralFactory({
            error: Error()
          }), ProceduralFactory) : ProceduralFactory)();
          this.playerZ = 3.1;
          this.roadHalfWidth = 2.75;
          this.scrollSpeed = 3.35;
          this.totalDistance = 240;
          this.enemyDespawnZ = 7.5;
          this.state = GameState.READY;
          this.world = void 0;
          this.playerRoot = void 0;
          this.effectRoot = void 0;
          this.speedAura = void 0;
          this.unitNodes = [];
          this.enemies = [];
          this.walls = [];
          this.megaWalls = [];
          this.woodenFences = [];
          this.agilityPickups = [];
          this.roadStripes = [];
          this.sceneryNodes = [];
          this.squadCount = 3;
          this.playerX = 0;
          this.targetPlayerX = 0;
          this.distance = 0;
          this.elapsed = 0;
          this.endTimer = 0;
          this.dragging = false;
          this.lastPointerX = 0;
          this.playerSpeed = 1;
          this.bonusActive = false;
          this.bonusCompleted = false;
          this.bonusTimer = 0;
          this.bonusParticleTimer = 0;
          this.bonusDuration = 10;
          this.squadLabel = void 0;
          this.distanceLabel = void 0;
          this.speedLabel = void 0;
          this.startOverlayNode = void 0;
          this.resultOverlayNode = void 0;
          this.titleLabel = void 0;
          this.subtitleLabel = void 0;
          this.resultLabel = void 0;
          this.hintLabel = void 0;
          this.ctaNode = void 0;
          this.ctaButton = void 0;
          this.ctaLabel = void 0;
          this.progressGraphics = void 0;
          this.toastNode = void 0;
          this.toastLabel = void 0;
          this.toastTimer = 0;
          this.shownToastMessages = new Set();
        }

        start() {
          view.setDesignResolutionSize(1280, 720, ResolutionPolicy.SHOW_ALL);
          this.buildScene();
          this.bindInput();
        }

        onDestroy() {
          var _this$ctaNode;

          input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
          input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          input.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
          input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
          input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
          input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
          (_this$ctaNode = this.ctaNode) == null || _this$ctaNode.off(Button.EventType.CLICK, this.onCtaClick, this);
        }

        update(deltaTime) {
          const dt = Math.min(deltaTime, 0.05);
          this.elapsed += dt;
          this.animateUnits();

          if (this.toastTimer > 0) {
            this.toastTimer -= dt;

            if (this.toastTimer <= 0) {
              this.toastNode.active = false;
            }
          }

          if (this.state === GameState.PLAYING) {
            this.playerX += (this.targetPlayerX - this.playerX) * Math.min(1, dt * 14);
            this.playerRoot.setPosition(this.playerX, 0, this.playerZ);
            this.distance += this.getCurrentScrollSpeed() * dt;
            this.updateRoad(dt);
            this.updateEnemies(dt);
            this.updateTrackItems(dt);

            if (this.bonusActive) {
              this.updateBonusRound(dt);
            }

            this.updateHud();
          } else if (this.state === GameState.WIN || this.state === GameState.LOSE) {
            this.endTimer += dt;

            if (this.resultOverlayNode.position.y !== 0) {
              this.resultOverlayNode.setPosition(0, 0, 0);
            }

            this.updateRoad(dt * 0.35);
            this.updateHud();
          }
        }

        buildScene() {
          const scene = director.getScene();

          if (!scene) {
            return;
          }

          this.world = new Node('PA World');
          this.world.setParent(scene);
          this.effectRoot = new Node('Effects');
          this.effectRoot.setParent(this.world);
          this.createCamera(scene);
          this.createEnvironment();
          this.createPlayer();
          this.createLevel();
          this.createHud(scene);
          this.updateHud();
        }

        createCamera(scene) {
          const cameraNode = new Node('Game Camera');
          cameraNode.setParent(scene);
          cameraNode.setPosition(0, 9.4, 14.2);
          cameraNode.lookAt(new Vec3(0, 0.8, -5.5));
          const camera = cameraNode.addComponent(Camera);
          camera.fov = 46;
          camera.near = 0.1;
          camera.far = 220;
          camera.clearColor = new Color(22, 43, 52, 255);
          camera.visibility = Layers.Enum.DEFAULT;
        }

        createEnvironment() {
          const roadRoot = new Node('Road');
          roadRoot.setParent(this.world);

          for (let z = 4; z >= -164; z -= 12) {
            this.factory.createRoadSegment(roadRoot, z);
          }

          for (let z = 2; z >= -160; z -= 4) {
            this.roadStripes.push(this.factory.createRoadStripe(roadRoot, z));
          }

          for (let i = 0; i < 48; i++) {
            const z = 3 - i * 5;
            const side = i % 2 === 0 ? -1 : 1;
            let scenery;

            if (i % 3 === 0) {
              scenery = this.createBuilding(side, z, i);
            } else if (i % 3 === 1) {
              scenery = this.createTree(side, z, i);
            } else {
              scenery = this.createMountain(side, z, i);
            }

            this.sceneryNodes.push(scenery);
          }
        }

        createBuilding(side, z, index) {
          const root = new Node('Detailed High Rise');
          root.setParent(this.world);
          root.setPosition(side * (5.1 + index % 3 * 0.6), 0, z);
          const height = 4.2 + index % 4 * 1.2;
          const bodyColor = index % 2 === 0 ? new Color(35, 78, 103) : new Color(59, 66, 101);
          const accentColor = index % 2 === 0 ? new Color(82, 188, 198) : new Color(133, 122, 205);
          this.factory.createBox('Foundation', root, new Vec3(0, 0.18, 0), new Vec3(2.15, 0.36, 2.2), new Color(38, 47, 57));
          this.factory.createBox('Tower', root, new Vec3(0, height * 0.5, 0), new Vec3(1.75, height, 1.85), bodyColor);
          this.factory.createBox('Entrance', root, new Vec3(0, 0.72, -0.95), new Vec3(0.62, 1.15, 0.08), accentColor);

          for (let floor = 0; floor < 4; floor++) {
            const windowY = 1.25 + floor * Math.max(0.75, (height - 1.7) / 4);
            this.factory.createBox(`Window Row ${floor + 1}`, root, new Vec3(0, windowY, -0.95), new Vec3(1.28, 0.18, 0.06), new Color(255, 220 - floor * 12, 116));
            this.factory.createBox(`Side Window ${floor + 1}`, root, new Vec3(-side * 0.9, windowY, 0), new Vec3(0.06, 0.18, 1.18), accentColor);
          }

          this.factory.createBox('Roof', root, new Vec3(0, height + 0.18, 0), new Vec3(1.3, 0.34, 1.35), accentColor);
          this.factory.createCylinder('Antenna', root, new Vec3(0, height + 0.85, 0), new Vec3(0.07, 1.35, 0.07), new Color(190, 214, 217));
          this.factory.createSphere('Beacon', root, new Vec3(0, height + 1.55, 0), new Vec3(0.18, 0.18, 0.18), new Color(255, 80, 88));
          return root;
        }

        createTree(side, z, index) {
          const root = new Node('Landscaped Grove');
          root.setParent(this.world);
          root.setPosition(side * (4.65 + index % 3 * 0.48), 0, z);
          this.factory.createCylinder('Ground Patch', root, new Vec3(0, 0.015, 0), new Vec3(1.5, 0.03, 1.5), new Color(54, 105, 72));
          this.factory.createCylinder('Trunk', root, new Vec3(0, 0.8, 0), new Vec3(0.26, 1.6, 0.26), new Color(105, 72, 48));
          this.factory.createSphere('Crown Lower', root, new Vec3(0, 1.8, 0), new Vec3(1.18, 1.08, 1.18), new Color(42, 139, 82));
          this.factory.createSphere('Crown Upper', root, new Vec3(0.24 * side, 2.5, 0), new Vec3(0.86, 0.94, 0.86), new Color(76, 191, 106));
          this.factory.createSphere('Bush Front', root, new Vec3(-0.72 * side, 0.42, -0.35), new Vec3(0.62, 0.62, 0.62), new Color(65, 168, 91));
          this.factory.createSphere('Bush Back', root, new Vec3(0.7 * side, 0.35, 0.38), new Vec3(0.48, 0.48, 0.48), new Color(36, 121, 74));
          const lampX = -side * 1.35;
          this.factory.createCylinder('Lamp Post', root, new Vec3(lampX, 1.05, -0.2), new Vec3(0.08, 2.1, 0.08), new Color(45, 58, 67));
          this.factory.createBox('Lamp Arm', root, new Vec3(lampX - side * 0.22, 2.08, -0.2), new Vec3(0.48, 0.08, 0.08), new Color(45, 58, 67));
          this.factory.createSphere('Lamp Glow', root, new Vec3(lampX - side * 0.45, 1.94, -0.2), new Vec3(0.24, 0.18, 0.24), new Color(255, 226, 131));
          return root;
        }

        createMountain(side, z, index) {
          const root = new Node('Layered Mountain Range');
          root.setParent(this.world);
          root.setPosition(side * (9.3 + index % 3 * 0.85), 0, z);
          const height = 6.2 + index % 4 * 0.9;
          this.factory.createCone('Rear Peak', root, new Vec3(side * 2.4, height * 0.45, 1.6), new Vec3(4.8, height * 0.9, 4.8), new Color(55, 79, 88));
          this.factory.createCone('Main Peak', root, new Vec3(0, height * 0.5 - 0.2, 0), new Vec3(5.2, height, 5.2), new Color(76, 104, 104));
          this.factory.createCone('Snow Line', root, new Vec3(0, height - 0.72, 0), new Vec3(1.7, 1.9, 1.7), new Color(224, 235, 229));
          this.factory.createBox('Rock Shelf', root, new Vec3(-side * 1.7, 0.45, -1.2), new Vec3(2.2, 0.85, 1.6), new Color(64, 83, 86));
          this.factory.createSphere('Foothill', root, new Vec3(side * 2.2, 0.72, -0.8), new Vec3(2.1, 1.15, 1.8), new Color(48, 91, 76));
          return root;
        }

        createPlayer() {
          this.playerRoot = new Node('Squad');
          this.playerRoot.setParent(this.world);
          this.playerRoot.setPosition(0, 0, this.playerZ);
          this.setSquadCount(this.squadCount);
          this.updateSpeedAura();
        }

        createLevel() {
          this.spawnWave(-38, 2, 0.65);
          this.spawnGiant(-72, -0.9);
          this.spawnWave(-105, 3, 0.7);
          this.spawnGiant(-138, 1.1);
          this.spawnWave(-168, 4, 0.75);
          this.spawnBrute(-184, 0.25);
          this.spawnGiant(-202, -1.25);
          this.spawnWave(-228, 5, 0.8);
          this.spawnFinalBoss();
          this.createTrackItems();
        }

        createTrackItems() {
          const wallPositions = [-24, -52, -82, -112, -142, -172, -202, -228];
          const fencePositions = [-40, -68, -98, -128, -158, -188, -218];
          this.spawnAgilityPickup(0, -1);
          this.spawnAgilityPickup(0, -4.5);
          const pickupCandidates = [-14, -34, -46, -64, -76, -94, -106, -124, -136, -154, -166, -184, -196, -214, -232];
          wallPositions.forEach((z, index) => this.spawnWall(this.randomLane(index + 11), z));
          fencePositions.forEach((z, index) => this.spawnWoodFence(this.randomLane(index + 91), z));
          pickupCandidates.forEach((z, index) => {
            if (this.seededRandom(index + 73) < 0.8) {
              this.spawnAgilityPickup(this.randomLane(index + 37), z);
            }
          });
        }

        seededRandom(seed) {
          const value = Math.sin(seed * 12.9898) * 43758.5453;
          return value - Math.floor(value);
        }

        randomLane(seed) {
          return this.seededRandom(seed) * 4.4 - 2.2;
        }

        spawnWall(x, z) {
          const node = new Node('White Wall');
          node.setParent(this.world);
          node.setPosition(x, 0, z);
          const color = new Color(242, 246, 248);
          this.factory.createCylinder('Wall Base', node, new Vec3(0, 0.025, 0), new Vec3(1.15, 0.04, 0.7), new Color(70, 155, 255));

          for (let row = 0; row < 3; row++) {
            for (let column = 0; column < 3; column++) {
              const offset = row % 2 === 0 ? 0 : 0.12;
              this.factory.createBox('Wall Block', node, new Vec3((column - 1) * 0.48 + offset, 0.28 + row * 0.48, 0), new Vec3(0.44, 0.42, 0.32), color);
            }
          }

          this.walls.push({
            node,
            width: 0.82,
            collected: false
          });
        }

        spawnMegaWall(z) {
          const node = new Node('Bonus Mega Wall');
          node.setParent(this.world);
          node.setPosition(0, 0, z);
          const wallColor = new Color(246, 248, 250);
          this.factory.createCylinder('Mega Wall Base', node, new Vec3(0, 0.03, 0), new Vec3(3.15, 0.05, 1.05), new Color(255, 72, 82));

          for (let row = 0; row < 4; row++) {
            for (let column = 0; column < 5; column++) {
              const offset = row % 2 === 0 ? 0 : 0.18;
              this.factory.createBox('Mega Wall Block', node, new Vec3((column - 2) * 0.68 + offset, 0.34 + row * 0.58, 0), new Vec3(0.62, 0.52, 0.48), row % 2 === 0 ? wallColor : new Color(226, 232, 236));
            }
          }

          this.megaWalls.push({
            node,
            width: 2.75,
            collected: false
          });
        }

        spawnWoodFence(x, z) {
          const node = new Node('Wood Fence');
          node.setParent(this.world);
          node.setPosition(x, 0, z);
          const wood = new Color(139, 88, 48);
          const lightWood = new Color(184, 126, 70);
          this.factory.createBox('Fence Piece', node, new Vec3(-1.05, 0.72, 0), new Vec3(0.2, 1.45, 0.24), wood);
          this.factory.createBox('Fence Piece', node, new Vec3(1.05, 0.72, 0), new Vec3(0.2, 1.45, 0.24), wood);

          for (let row = 0; row < 3; row++) {
            this.factory.createBox('Fence Piece', node, new Vec3(0, 0.36 + row * 0.43, 0), new Vec3(2.35, 0.18, 0.2), row % 2 === 0 ? lightWood : wood);
          }

          const brace = this.factory.createBox('Fence Piece', node, new Vec3(0, 0.78, -0.05), new Vec3(2.2, 0.16, 0.18), lightWood);
          brace.setRotationFromEuler(0, 0, 24);
          this.woodenFences.push({
            node,
            width: 1.35,
            collected: false
          });
        }

        spawnAgilityPickup(x, z) {
          const node = new Node('Agility Medicine');
          node.setParent(this.world);
          node.setPosition(x, 0, z);
          const color = new Color(91, 241, 178);
          this.factory.createCylinder('Medicine', node, new Vec3(0, 0.7, 0), new Vec3(0.38, 0.85, 0.38), color);
          this.factory.createSphere('Cap', node, new Vec3(0, 1.2, 0), new Vec3(0.42, 0.28, 0.42), new Color(236, 255, 250));
          this.factory.createBox('Cross H', node, new Vec3(0, 0.72, -0.4), new Vec3(0.34, 0.1, 0.05), Color.WHITE);
          this.factory.createBox('Cross V', node, new Vec3(0, 0.72, -0.4), new Vec3(0.1, 0.34, 0.05), Color.WHITE);
          this.agilityPickups.push({
            node,
            width: 0.55,
            collected: false
          });
        }

        spawnWave(z, count, speed) {
          const columns = count > 10 ? 5 : count > 5 ? 4 : 3;

          for (let i = 0; i < count; i++) {
            const row = Math.floor(i / columns);
            const column = i % columns;
            const rowCount = Math.min(columns, count - row * columns);
            const x = (column - (rowCount - 1) * 0.5) * 1.08;
            const enemyNode = this.factory.createEnemy(`Enemy ${this.enemies.length + 1}`, this.world);
            enemyNode.setPosition(x, 0, z - row * 1.05);
            this.enemies.push({
              node: enemyNode,
              speed,
              radius: 0.48,
              strength: 1,
              finalBoss: false,
              alive: true,
              crossedPlayer: false,
              seed: i * 0.71 + Math.abs(z)
            });
          }
        }

        spawnGiant(z, x) {
          const node = this.factory.createEnemy(`Giant ${this.enemies.length + 1}`, this.world, 2);
          node.setPosition(x, 0, z);
          this.enemies.push({
            node,
            speed: 0.5,
            radius: 1.05,
            strength: 2,
            finalBoss: false,
            alive: true,
            crossedPlayer: false,
            seed: Math.abs(z) * 0.83
          });
        }

        spawnBrute(z, x) {
          const node = this.factory.createEnemy(`Brute ${this.enemies.length + 1}`, this.world, 3);
          node.setPosition(x, 0, z);
          this.enemies.push({
            node,
            speed: 0.38,
            radius: 1.35,
            strength: 3,
            finalBoss: false,
            alive: true,
            crossedPlayer: false,
            seed: Math.abs(z) * 0.91
          });
        }

        spawnFinalBoss() {
          const node = this.factory.createEnemy('Final Red Brute Boss', this.world, 5);
          const bossZ = this.playerZ - 0.45 - this.totalDistance * 0.99;
          node.setPosition(0, 0, bossZ);
          this.enemies.push({
            node,
            speed: 0,
            radius: 3.3,
            strength: 5,
            finalBoss: true,
            alive: true,
            crossedPlayer: false,
            seed: 999
          });
        }

        createHud(scene) {
          const canvasNode = new Node('HUD');
          canvasNode.layer = Layers.Enum.UI_2D;
          canvasNode.setParent(scene);
          const canvasTransform = canvasNode.addComponent(UITransform);
          canvasTransform.setContentSize(1280, 720);
          const uiCameraNode = new Node('UI Camera');
          uiCameraNode.setParent(scene);
          uiCameraNode.setPosition(0, 0, 1000);
          const uiCamera = uiCameraNode.addComponent(Camera);
          uiCamera.projection = Camera.ProjectionType.ORTHO;
          uiCamera.orthoHeight = 360;
          uiCamera.near = 1;
          uiCamera.far = 2000;
          uiCamera.clearFlags = Camera.ClearFlag.DEPTH_ONLY;
          uiCamera.visibility = Layers.Enum.UI_2D;
          uiCamera.priority = 1;
          const canvas = canvasNode.addComponent(Canvas);
          canvas.cameraComponent = uiCamera;
          const topPanel = this.createPanel(canvasNode, 'Top Panel', 1120, 86, new Color(11, 24, 31, 210));
          topPanel.setPosition(0, 305);
          this.squadLabel = this.createLabel(topPanel, 'Squad Count', 'SQUAD  x3', 28, new Color(113, 238, 255), new Vec3(-410, 8), 240, 46);
          this.speedLabel = this.createLabel(topPanel, 'Player Speed', 'SPEED  1', 24, new Color(91, 241, 178), new Vec3(285, 8), 180, 46);
          this.distanceLabel = this.createLabel(topPanel, 'Distance', '0%', 26, Color.WHITE, new Vec3(455, 8), 110, 46);
          this.createLabel(topPanel, 'Mission', 'REACH THE FINISH', 18, new Color(190, 204, 211), new Vec3(0, 10), 320, 40);
          const progressNode = new Node('Progress');
          progressNode.layer = Layers.Enum.UI_2D;
          progressNode.setParent(topPanel);
          progressNode.setPosition(0, -25);
          progressNode.addComponent(UITransform).setContentSize(760, 12);
          this.progressGraphics = progressNode.addComponent(Graphics);
          this.toastNode = this.createPanel(canvasNode, 'Toast', 430, 84, new Color(9, 35, 42, 235));
          this.toastNode.setPosition(0, 140);
          this.toastLabel = this.createLabel(this.toastNode, 'Toast Label', '', 30, new Color(115, 242, 255), new Vec3(), 390, 60);
          this.toastNode.active = false;
          this.startOverlayNode = this.createFullscreenOverlay(canvasNode, 'Start Overlay', new Color(7, 18, 24, 172));
          this.createLabel(this.startOverlayNode, 'Title', 'SQUAD RUSH', 64, new Color(105, 239, 255), new Vec3(0, 115), 760, 90);
          this.createLabel(this.startOverlayNode, 'Subtitle', 'SMASH THE LINE', 25, new Color(255, 215, 108), new Vec3(0, 55), 560, 45);
          this.createLabel(this.startOverlayNode, 'Hint', 'DRAG TO MOVE\nTAP TO START', 24, Color.WHITE, new Vec3(0, -35), 520, 80);
          const startCta = this.createPanel(this.startOverlayNode, 'Start CTA', 430, 90, new Color(48, 208, 134, 255));
          startCta.setPosition(0, -155);
          this.createLabel(startCta, 'CTA Label', 'START MISSION', 32, new Color(7, 34, 29), new Vec3(), 390, 62);
          this.resultOverlayNode = this.createFullscreenOverlay(canvasNode, 'Result Overlay', new Color(7, 18, 24, 232));
          this.titleLabel = this.createLabel(this.resultOverlayNode, 'Result Title', '', 58, Color.WHITE, new Vec3(0, 115), 900, 90);
          this.subtitleLabel = this.createLabel(this.resultOverlayNode, 'Result Subtitle', '', 24, new Color(255, 215, 108), new Vec3(0, 55), 680, 44);
          this.resultLabel = this.createLabel(this.resultOverlayNode, 'Result Detail', '', 28, Color.WHITE, new Vec3(0, -5), 720, 55);
          this.hintLabel = this.createLabel(this.resultOverlayNode, 'Result Hint', '', 22, new Color(190, 204, 211), new Vec3(0, -65), 640, 44);
          this.ctaNode = this.createPanel(this.resultOverlayNode, 'Replay CTA', 460, 104, new Color(48, 208, 134, 255));
          this.ctaNode.setPosition(0, -155);
          this.ctaButton = this.ctaNode.addComponent(Button);
          this.ctaButton.transition = Button.Transition.SCALE;
          this.ctaButton.zoomScale = 0.96;
          this.ctaButton.duration = 0.08;
          this.ctaNode.on(Button.EventType.CLICK, this.onCtaClick, this);
          this.ctaLabel = this.createLabel(this.ctaNode, 'CTA Label', '', 34, new Color(7, 34, 29), new Vec3(), 420, 70);
          this.resultOverlayNode.setPosition(0, -1600, 0);
        }

        createFullscreenOverlay(parent, name, color) {
          const node = new Node(name);
          node.layer = Layers.Enum.UI_2D;
          node.setParent(parent);
          node.addComponent(UITransform).setContentSize(1280, 720);
          const graphics = node.addComponent(Graphics);
          graphics.fillColor = color;
          graphics.rect(-640, -360, 1280, 720);
          graphics.fill();
          return node;
        }

        createPanel(parent, name, width, height, color) {
          const node = new Node(name);
          node.layer = Layers.Enum.UI_2D;
          node.setParent(parent);
          node.addComponent(UITransform).setContentSize(width, height);
          const graphics = node.addComponent(Graphics);
          graphics.fillColor = color;
          graphics.roundRect(-width * 0.5, -height * 0.5, width, height, 8);
          graphics.fill();
          return node;
        }

        createLabel(parent, name, text, fontSize, color, position, width, height) {
          const node = new Node(name);
          node.layer = Layers.Enum.UI_2D;
          node.setParent(parent);
          node.setPosition(position);
          node.addComponent(UITransform).setContentSize(width, height);
          const label = node.addComponent(Label);
          label.string = text;
          label.fontSize = fontSize;
          label.lineHeight = Math.floor(fontSize * 1.18);
          label.color = color;
          label.horizontalAlign = HorizontalTextAlignment.CENTER;
          label.verticalAlign = VerticalTextAlignment.CENTER;
          label.overflow = Label.Overflow.SHRINK;
          label.isBold = true;
          return label;
        }

        bindInput() {
          input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
          input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
          input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
          input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
          input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        }

        onTouchStart(event) {
          this.handlePointerStart(event.getLocation().x);
        }

        onTouchMove(event) {
          this.handlePointerMove(event.getLocation().x);
        }

        onTouchEnd() {
          this.dragging = false;
        }

        onMouseDown(event) {
          this.handlePointerStart(event.getLocation().x);
        }

        onMouseMove(event) {
          this.handlePointerMove(event.getLocation().x);
        }

        onMouseUp() {
          this.dragging = false;
        }

        handlePointerStart(x) {
          if (this.state === GameState.WIN || this.state === GameState.LOSE) {
            return;
          }

          if (this.state === GameState.READY) {
            this.state = GameState.PLAYING;
            this.startOverlayNode.active = false;
            console.info('[PA] challenge_started');
          }

          this.dragging = true;
          this.lastPointerX = x;
        }

        onCtaClick() {
          if (this.state === GameState.WIN || this.state === GameState.LOSE) {
            director.loadScene('main');
          }
        }

        handlePointerMove(x) {
          if (!this.dragging || this.state !== GameState.PLAYING) {
            return;
          }

          const delta = x - this.lastPointerX;
          this.lastPointerX = x;
          this.targetPlayerX = Math.max(-this.roadHalfWidth, Math.min(this.roadHalfWidth, this.targetPlayerX + delta * 0.012));
        }

        updateRoad(dt) {
          const scrollSpeed = this.getCurrentScrollSpeed();

          for (const stripe of this.roadStripes) {
            const position = stripe.position;
            let z = position.z + scrollSpeed * dt;

            if (z > 7) {
              z -= 164;
            }

            stripe.setPosition(position.x, position.y, z);
          }

          for (const scenery of this.sceneryNodes) {
            const position = scenery.position;
            let z = position.z + scrollSpeed * dt;

            if (z > 12) {
              z -= 240;
            }

            scenery.setPosition(position.x, position.y, z);
          }
        }

        updateEnemies(dt) {
          const scrollSpeed = this.getCurrentScrollSpeed();

          for (const enemy of this.enemies) {
            if (!enemy.alive) {
              continue;
            }

            const position = enemy.node.position;
            const z = position.z + (scrollSpeed + enemy.speed) * dt;
            const sway = Math.sin(this.elapsed * 2.2 + enemy.seed) * 0.08;
            const x = position.x + sway * dt;
            enemy.node.setPosition(x, Math.abs(Math.sin(this.elapsed * 5 + enemy.seed)) * 0.04, z);
            enemy.node.setRotationFromEuler(0, 180, Math.sin(this.elapsed * 5 + enemy.seed) * 3);

            if (!enemy.crossedPlayer && z >= this.playerZ - 0.45) {
              enemy.crossedPlayer = true;
              const touchesSquad = Math.abs(x - this.playerX) <= enemy.radius + this.getSquadHalfWidth();

              if (touchesSquad) {
                if (enemy.finalBoss) {
                  enemy.alive = false;

                  if (this.playerSpeed === 5) {
                    this.showToast('MAX SPEED  BOSS DEFEATED', new Color(255, 92, 92));
                    this.spawnBurst(enemy.node.position, new Color(255, 72, 72), 3.2);
                    tween(enemy.node).to(0.65, {
                      position: new Vec3(0, 4.8, this.playerZ + 3),
                      scale: new Vec3(0.05, 0.05, 0.05)
                    }, {
                      easing: 'quadOut'
                    }).call(() => {
                      enemy.node.destroy();
                      this.startBonusRound();
                    }).start();
                  } else {
                    this.showToast('SPEED 5 REQUIRED', new Color(255, 92, 92));
                    this.spawnBurst(new Vec3(this.playerX, 1, this.playerZ), new Color(255, 72, 72), 2.5);
                    this.playerRoot.active = false;
                    this.finish(GameState.LOSE);
                  }

                  continue;
                }

                enemy.alive = false;
                this.spawnBloodParticles(enemy.node.position, enemy.strength);
                const enemyName = enemy.strength === 3 ? 'BRUTE' : enemy.strength === 2 ? 'GIANT' : 'ENEMY';

                if (this.playerSpeed < enemy.strength) {
                  this.setPlayerSpeed(this.playerSpeed - 1);
                  this.showToast(`${enemyName} TOO STRONG  SPEED -1`, new Color(190, 116, 255));
                } else {
                  this.showToast(`${enemyName} KNOCKED AWAY`, new Color(255, 215, 108));
                }

                const knockDistance = enemy.strength === 3 ? 6.8 : enemy.strength === 2 ? 5.9 : 4.8;
                const knockHeight = enemy.strength === 3 ? 4.2 : enemy.strength === 2 ? 3.6 : 2.9;
                const launchScale = enemy.strength === 3 ? 1.45 : enemy.strength === 2 ? 1.1 : 0.75;
                const launchDuration = enemy.strength === 3 ? 0.9 : enemy.strength === 2 ? 0.78 : 0.65;
                const shrinkDuration = enemy.strength === 3 ? 0.95 : enemy.strength === 2 ? 0.85 : 0.75;
                const knockAngle = this.seededRandom(Math.floor(enemy.seed * 31) + 17) * Math.PI * 2;
                const directionX = Math.cos(knockAngle);
                const directionZ = Math.sin(knockAngle);
                const launchTarget = new Vec3(x + directionX * knockDistance, knockHeight, z + directionZ * knockDistance);
                const vanishTarget = new Vec3(launchTarget.x + directionX * 1.8, launchTarget.y + 1.1, launchTarget.z + directionZ * 1.8);
                enemy.node.setRotationFromEuler(enemy.seed * 13, enemy.seed * 29, enemy.seed * 41);
                const totalKnockDuration = launchDuration + shrinkDuration;
                tween(enemy.node).to(totalKnockDuration, {
                  eulerAngles: new Vec3(720 + enemy.seed * 17, 1080 + enemy.seed * 11, 540 + enemy.seed * 23)
                }, {
                  easing: 'linear'
                }).start();
                tween(enemy.node).to(launchDuration, {
                  position: launchTarget,
                  scale: new Vec3(launchScale, launchScale, launchScale)
                }, {
                  easing: 'quadOut'
                }).to(shrinkDuration, {
                  position: vanishTarget,
                  scale: new Vec3(0.05, 0.05, 0.05)
                }, {
                  easing: 'quadIn'
                }).call(() => enemy.node.destroy()).start();
                continue;
              }
            }

            if (z >= this.enemyDespawnZ) {
              enemy.alive = false;
              enemy.node.destroy();
            }
          }

          this.enemies = this.enemies.filter(enemy => enemy.alive);
        }

        startBonusRound() {
          this.bonusActive = true;
          this.bonusTimer = 0;
          this.bonusParticleTimer = 0;
          this.playerSpeed = 5;
          this.updateSpeedAura();
          this.showToast('BONUS ROUND  10 SECONDS', new Color(255, 220, 92));

          for (let index = 0; index < 36; index++) {
            const z = -6 - index * 4.35;
            const x = this.randomLane(index + 151);

            if (index % 3 === 0) {
              this.spawnMegaWall(z);
            } else if (index % 3 === 1) {
              this.spawnWall(x, z);
            } else {
              this.spawnWoodFence(x, z);
            }
          }
        }

        updateBonusRound(dt) {
          this.bonusTimer += dt;
          this.bonusParticleTimer += dt;

          while (this.bonusParticleTimer >= 0.06) {
            this.bonusParticleTimer -= 0.06;
            this.spawnBonusParticle();
          }

          if (this.bonusTimer >= this.bonusDuration) {
            this.bonusCompleted = true;
            this.bonusActive = false;
            this.finish(GameState.WIN);
          }
        }

        spawnBonusParticle() {
          const colors = [new Color(255, 218, 74), new Color(75, 235, 255), new Color(194, 92, 255), new Color(255, 80, 92)];
          const particleIndex = Math.floor(this.bonusTimer * 18) % colors.length;
          const angle = this.bonusTimer * 8.5 + particleIndex * Math.PI * 0.5;
          const radius = 0.8 + particleIndex % 2 * 0.35;
          const start = new Vec3(this.playerX + Math.cos(angle) * radius, 0.35 + particleIndex % 3 * 0.3, this.playerZ + Math.sin(angle) * radius);
          const particle = this.factory.createSphere('Bonus Particle', this.effectRoot, start, new Vec3(0.13, 0.13, 0.13), colors[particleIndex]);
          tween(particle).to(0.55, {
            position: new Vec3(start.x + Math.cos(angle) * 0.9, start.y + 1.4, start.z + Math.sin(angle) * 0.9),
            scale: new Vec3(0.02, 0.02, 0.02)
          }, {
            easing: 'quadOut'
          }).call(() => particle.destroy()).start();
        }

        getSquadHalfWidth() {
          let halfWidth = 0.3;

          for (const unit of this.unitNodes) {
            halfWidth = Math.max(halfWidth, Math.abs(unit.position.x) + 0.25);
          }

          return halfWidth;
        }

        setPlayerSpeed(value) {
          if (this.bonusActive && value < 5) {
            return;
          }

          const nextSpeed = Math.max(0, Math.min(5, value));

          if (nextSpeed === this.playerSpeed) {
            return;
          }

          this.playerSpeed = nextSpeed;
          this.updateSpeedAura();
        }

        updateSpeedAura() {
          var _this$speedAura;

          (_this$speedAura = this.speedAura) == null || _this$speedAura.destroy();
          this.speedAura = new Node('Speed Aura');
          this.speedAura.setParent(this.playerRoot);
          this.speedAura.setPosition(0, 0.035, 0.35);
          const color = this.getSpeedAuraColor();
          this.factory.createCylinder('Aura Core', this.speedAura, new Vec3(), new Vec3(1.65, 0.025, 1.65), color);
          this.factory.createSphere('Aura Glow', this.speedAura, new Vec3(0, 0.03, 0), new Vec3(1.25, 0.035, 1.25), new Color(color.r, color.g, color.b, 150));
        }

        getSpeedAuraColor() {
          switch (this.playerSpeed) {
            case 1:
              return new Color(65, 232, 135, 190);

            case 2:
              return new Color(70, 165, 255, 190);

            case 3:
              return new Color(176, 92, 244, 190);

            case 4:
              return new Color(255, 205, 72, 200);

            case 5:
              return new Color(255, 76, 88, 210);

            default:
              return new Color(135, 145, 150, 135);
          }
        }

        getCurrentScrollSpeed() {
          const speedMultipliers = [0.5, 1, 2, 3, 4, 5];
          return this.scrollSpeed * speedMultipliers[this.playerSpeed];
        }

        updateTrackItems(dt) {
          const scrollSpeed = this.getCurrentScrollSpeed();
          this.updateTrackItemGroup(this.walls, scrollSpeed, dt, 'wall');
          this.updateTrackItemGroup(this.megaWalls, scrollSpeed, dt, 'megaWall');
          this.updateTrackItemGroup(this.woodenFences, scrollSpeed, dt, 'fence');
          this.updateTrackItemGroup(this.agilityPickups, scrollSpeed, dt, 'pickup');
          this.walls = this.walls.filter(item => !item.collected);
          this.megaWalls = this.megaWalls.filter(item => !item.collected);
          this.woodenFences = this.woodenFences.filter(item => !item.collected);
          this.agilityPickups = this.agilityPickups.filter(item => !item.collected);
        }

        updateTrackItemGroup(items, scrollSpeed, dt, kind) {
          for (const item of items) {
            if (item.collected) {
              continue;
            }

            const position = item.node.position;
            item.node.setPosition(position.x, position.y, position.z + scrollSpeed * dt);
            item.node.setRotationFromEuler(0, kind === 'pickup' ? this.elapsed * 90 : 0, 0);

            if (item.node.position.z < this.playerZ - 0.35) {
              continue;
            }

            const touchesPlayer = Math.abs(item.node.position.x - this.playerX) <= item.width + this.getSquadHalfWidth();
            const objectIsShattering = touchesPlayer && kind !== 'pickup';

            if (touchesPlayer) {
              if (kind === 'wall') {
                if (!this.bonusActive) {
                  this.setPlayerSpeed(this.playerSpeed - 1);
                  this.showToast('WALL HIT  SPEED -1', Color.WHITE);
                }

                this.spawnDustCloud(item.node.position);
                this.shatterWall(item.node);
              } else if (kind === 'megaWall') {
                this.spawnMegaDustCloud(item.node.position);
                this.shatterMegaWall(item.node);
              } else if (kind === 'fence') {
                if (!this.bonusActive) {
                  this.setPlayerSpeed(this.playerSpeed - 1);
                  this.showToast('FENCE HIT  SPEED -1', new Color(220, 164, 98));
                }

                this.shatterWoodFence(item.node);
              } else {
                const previousSpeed = this.playerSpeed;
                this.setPlayerSpeed(this.playerSpeed + 1);

                if (previousSpeed < 5) {
                  this.showToast('AGILITY  SPEED +1', new Color(91, 241, 178));
                }

                this.spawnBurst(item.node.position, new Color(91, 241, 178), 1.1);
              }
            }

            item.collected = true;

            if (!objectIsShattering) {
              item.node.destroy();
            }
          }
        }

        addSquad(value) {
          this.setSquadCount(Math.min(100, this.squadCount + value));
        }

        removeSquad(value) {
          this.setSquadCount(Math.max(0, this.squadCount - value));

          if (this.squadCount <= 0) {
            this.finish(GameState.LOSE);
          }
        }

        setSquadCount(value) {
          this.squadCount = value;

          while (this.unitNodes.length < this.squadCount) {
            const index = this.unitNodes.length;
            const unit = this.factory.createSoldier(`Ranger ${index + 1}`, this.playerRoot, new Color(50, 169, 219));
            unit.setScale(0, 0, 0);
            tween(unit).to(0.18, {
              scale: new Vec3(1, 1, 1)
            }, {
              easing: 'backOut'
            }).start();
            this.unitNodes.push(unit);
          }

          while (this.unitNodes.length > this.squadCount) {
            const unit = this.unitNodes.pop();
            unit == null || unit.destroy();
          }

          this.arrangeSquad();
        }

        arrangeSquad() {
          for (let i = 0; i < this.unitNodes.length; i++) {
            this.unitNodes[i].setPosition(this.getFormationPosition(i));
          }
        }

        animateUnits() {
          for (let i = 0; i < this.unitNodes.length; i++) {
            const formationPosition = this.getFormationPosition(i);
            const bob = this.state === GameState.PLAYING ? Math.abs(Math.sin(this.elapsed * 7 + i * 0.6)) * 0.05 : 0;
            this.unitNodes[i].setPosition(formationPosition.x, bob, formationPosition.z);
            this.unitNodes[i].setRotationFromEuler(0, 0, Math.sin(this.elapsed * 7 + i) * 2.5);
          }

          const auraPulse = 1 + Math.sin(this.elapsed * (3 + this.playerSpeed)) * 0.06;
          this.speedAura.setScale(auraPulse, auraPulse, auraPulse);
          this.speedAura.setRotationFromEuler(0, this.elapsed * (18 + this.playerSpeed * 8), 0);
        }

        getFormationPosition(index) {
          const columns = Math.min(10, Math.max(1, Math.ceil(Math.sqrt(this.unitNodes.length))));
          const row = Math.floor(index / columns);
          const column = index % columns;
          const rowCount = Math.min(columns, this.unitNodes.length - row * columns);
          const baseX = (column - (rowCount - 1) * 0.5) * 0.48;
          const offsetX = (row % 2 === 0 ? -0.04 : 0.06) + (column % 2 === 0 ? -0.015 : 0.015);
          const offsetZ = column % 2 === 0 ? 0 : 0.06;
          return new Vec3(baseX + offsetX, 0, row * 0.38 + offsetZ);
        }

        spawnImpact(position, color) {
          const node = this.factory.createSphere('Impact', this.effectRoot, new Vec3(position.x, 0.9, position.z), new Vec3(0.18, 0.18, 0.18), color);
          tween(node).to(0.12, {
            scale: new Vec3(0.5, 0.5, 0.5)
          }).call(() => node.destroy()).start();
        }

        spawnDustCloud(position) {
          const dustColors = [new Color(132, 91, 55), new Color(163, 116, 70), new Color(104, 72, 48)];

          for (let index = 0; index < 12; index++) {
            const angle = Math.PI * 2 * index / 12;
            const distance = 1.1 + index % 4 * 0.34;
            const dust = this.factory.createSphere('Dust', this.effectRoot, new Vec3(position.x, 0.25 + index % 3 * 0.18, position.z), new Vec3(0.22, 0.16, 0.22), dustColors[index % dustColors.length]);
            tween(dust).to(0.7 + index % 3 * 0.1, {
              position: new Vec3(position.x + Math.cos(angle) * distance, 0.7 + index % 4 * 0.24, position.z + Math.sin(angle) * distance),
              scale: new Vec3(0.62, 0.42, 0.62)
            }, {
              easing: 'quadOut'
            }).to(0.28, {
              scale: new Vec3(0.02, 0.02, 0.02)
            }, {
              easing: 'quadIn'
            }).call(() => dust.destroy()).start();
          }
        }

        spawnBloodParticles(position, strength) {
          const count = 8 + strength * 2;

          for (let index = 0; index < count; index++) {
            const angle = Math.PI * 2 * index / count + strength * 0.13;
            const distance = 0.8 + index % 4 * 0.28 + strength * 0.12;
            const particle = this.factory.createSphere('Red Impact Particle', this.effectRoot, new Vec3(position.x, 0.85, position.z), new Vec3(0.09, 0.09, 0.09), index % 2 === 0 ? new Color(218, 38, 48) : new Color(154, 18, 32));
            tween(particle).to(0.38 + index % 3 * 0.08, {
              position: new Vec3(position.x + Math.cos(angle) * distance, 0.55 + index % 5 * 0.32, position.z + Math.sin(angle) * distance),
              scale: new Vec3(0.025, 0.025, 0.025)
            }, {
              easing: 'quadOut'
            }).call(() => particle.destroy()).start();
          }
        }

        shatterWoodFence(fence) {
          const pieces = [...fence.children].filter(child => child.name === 'Fence Piece');

          for (let index = 0; index < pieces.length; index++) {
            const piece = pieces[index];
            const angle = Math.PI * 2 * index / pieces.length + 0.3;
            const start = piece.position;
            piece.setRotationFromEuler(index * 41, index * 57, index * 33);
            tween(piece).to(0.75 + index % 3 * 0.1, {
              position: new Vec3(start.x + Math.cos(angle) * (2 + index % 2 * 0.7), 1.5 + index % 3 * 0.65, start.z + Math.sin(angle) * (2 + index % 2 * 0.7)),
              scale: new Vec3(0.12, 0.12, 0.12)
            }, {
              easing: 'quadOut'
            }).call(() => piece.destroy()).start();
          }

          const fencePosition = fence.position;

          for (let index = 0; index < 12; index++) {
            const angle = Math.PI * 2 * index / 12 + 0.15;
            const chip = this.factory.createBox('Wood Chip', this.effectRoot, new Vec3(fencePosition.x, 0.65, fencePosition.z), new Vec3(0.12 + index % 3 * 0.04, 0.07, 0.05), index % 2 === 0 ? new Color(174, 111, 60) : new Color(112, 67, 38));
            chip.setRotationFromEuler(index * 31, index * 47, index * 19);
            tween(chip).to(0.55 + index % 4 * 0.08, {
              position: new Vec3(fencePosition.x + Math.cos(angle) * (1.5 + index % 3 * 0.45), 1 + index % 5 * 0.36, fencePosition.z + Math.sin(angle) * (1.5 + index % 3 * 0.45)),
              scale: new Vec3(0.02, 0.02, 0.02)
            }, {
              easing: 'quadOut'
            }).call(() => chip.destroy()).start();
          }

          this.scheduleOnce(() => fence.destroy(), 1.25);
        }

        spawnMegaDustCloud(position) {
          this.spawnDustCloud(new Vec3(position.x - 1.4, position.y, position.z));
          this.spawnDustCloud(new Vec3(position.x + 1.4, position.y, position.z));
        }

        shatterMegaWall(wall) {
          var _wall$getChildByName;

          (_wall$getChildByName = wall.getChildByName('Mega Wall Base')) == null || _wall$getChildByName.destroy();
          const blocks = [...wall.children].filter(child => child.name === 'Mega Wall Block');

          for (let index = 0; index < blocks.length; index++) {
            const block = blocks[index];
            const angle = Math.PI * 2 * index / blocks.length + index % 3 * 0.19;
            const distance = 4.5 + index % 5 * 0.75;
            const start = block.position;
            const launchTarget = new Vec3(start.x + Math.cos(angle) * distance, 2.4 + index % 5 * 0.82, start.z + Math.sin(angle) * distance);
            const vanishTarget = new Vec3(launchTarget.x + Math.cos(angle) * 2.2, launchTarget.y + 1.4, launchTarget.z + Math.sin(angle) * 2.2);
            block.setRotationFromEuler(index * 47, index * 67, index * 31);
            tween(block).to(0.85 + index % 4 * 0.1, {
              position: launchTarget,
              scale: new Vec3(0.42, 0.42, 0.42)
            }, {
              easing: 'quadOut'
            }).to(0.65 + index % 3 * 0.08, {
              position: vanishTarget,
              scale: new Vec3(0.04, 0.04, 0.04)
            }, {
              easing: 'quadIn'
            }).call(() => block.destroy()).start();
          }

          this.scheduleOnce(() => wall.destroy(), 2.1);
        }

        shatterWall(wall) {
          var _wall$getChildByName2;

          (_wall$getChildByName2 = wall.getChildByName('Wall Base')) == null || _wall$getChildByName2.destroy();
          const blocks = [...wall.children].filter(child => child.name === 'Wall Block');

          for (let index = 0; index < blocks.length; index++) {
            const block = blocks[index];
            const angle = Math.PI * 2 * index / blocks.length + index % 2 * 0.28;
            const distance = 2.7 + index % 3 * 0.72;
            const start = block.position;
            const launchTarget = new Vec3(start.x + Math.cos(angle) * distance, 1.8 + index % 4 * 0.72, start.z + Math.sin(angle) * distance);
            const vanishTarget = new Vec3(launchTarget.x + Math.cos(angle) * 1.2, launchTarget.y + 0.8, launchTarget.z + Math.sin(angle) * 1.2);
            block.setRotationFromEuler(index * 37, index * 53, index * 23);
            tween(block).to(0.7 + index % 3 * 0.1, {
              position: launchTarget,
              scale: new Vec3(0.28, 0.28, 0.28)
            }, {
              easing: 'quadOut'
            }).to(0.42 + index % 2 * 0.1, {
              position: vanishTarget,
              scale: new Vec3(0.03, 0.03, 0.03)
            }, {
              easing: 'quadIn'
            }).call(() => block.destroy()).start();
          }

          this.scheduleOnce(() => wall.destroy(), 1.45);
        }

        spawnBurst(position, color, size) {
          for (let i = 0; i < 6; i++) {
            const angle = Math.PI * 2 * i / 6;
            const node = this.factory.createBox('Burst', this.effectRoot, new Vec3(position.x, 0.7, position.z), new Vec3(0.16, 0.16, 0.16), color);
            const target = new Vec3(position.x + Math.cos(angle) * size, 0.8 + i % 2 * 0.55, position.z + Math.sin(angle) * size);
            tween(node).to(0.28, {
              position: target,
              scale: new Vec3(0.02, 0.02, 0.02)
            }, {
              easing: 'quadOut'
            }).call(() => node.destroy()).start();
          }
        }

        showToast(text, color) {
          if (this.shownToastMessages.has(text)) {
            return;
          }

          this.shownToastMessages.add(text);
          this.toastLabel.string = text;
          this.toastLabel.color = color;
          this.toastNode.active = true;
          this.toastNode.setScale(0.8, 0.8, 0.8);
          tween(this.toastNode).to(0.18, {
            scale: new Vec3(1, 1, 1)
          }, {
            easing: 'backOut'
          }).start();
          this.toastTimer = 1.2;
        }

        updateHud() {
          this.squadLabel.string = `SQUAD  x${this.squadCount}`;
          this.speedLabel.string = this.bonusActive ? `SPEED  5  BONUS ${Math.max(0, Math.ceil(this.bonusDuration - this.bonusTimer))}s` : `SPEED  ${this.playerSpeed}`;
          const progress = Math.max(0, Math.min(1, this.distance / this.totalDistance));
          this.distanceLabel.string = `${Math.floor(progress * 100)}%`;
          this.drawBar(this.progressGraphics, 760, 12, progress, new Color(77, 227, 201), new Color(42, 58, 65));
        }

        drawBar(graphics, width, height, value, fill, background) {
          graphics.clear();
          graphics.fillColor = background;
          graphics.roundRect(-width * 0.5, -height * 0.5, width, height, height * 0.5);
          graphics.fill();

          if (value > 0) {
            graphics.fillColor = fill;
            graphics.roundRect(-width * 0.5, -height * 0.5, Math.max(height, width * value), height, height * 0.5);
            graphics.fill();
          }
        }

        finish(result) {
          if (this.state === GameState.WIN || this.state === GameState.LOSE) {
            return;
          }

          this.dragging = false;
          this.endTimer = 0;
          const won = result === GameState.WIN;
          this.titleLabel.string = won ? 'VICTORY' : 'MISSION FAILED';
          this.titleLabel.color = won ? new Color(255, 220, 105) : new Color(255, 112, 112);
          this.subtitleLabel.string = won ? this.bonusCompleted ? 'BONUS COMPLETE' : 'FINISH LINE REACHED' : 'THE LINE WAS BROKEN';
          const progressPercent = Math.min(100, Math.floor(this.distance / this.totalDistance * 100));
          this.resultLabel.string = won ? this.bonusCompleted ? 'MAX SPEED REWARD CLEARED' : 'RUN COMPLETE' : `SQUAD LOST  -  ${progressPercent}%`;
          this.hintLabel.string = won ? 'MISSION COMPLETE' : 'REGROUP AND TRY AGAIN';
          this.ctaButton.interactable = true;
          this.ctaLabel.string = won ? '再玩一次' : '重新开始';
          this.resultOverlayNode.setPosition(0, 0, 0);
          this.state = result;
          console.info('[PA] result_overlay_shown', this.resultOverlayNode.activeInHierarchy, this.resultOverlayNode.position);
          console.info(result === GameState.WIN ? '[PA] challenge_solved' : '[PA] challenge_failed');
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=09882beb96cb59e225b88ae22160572fd8fde1bc.js.map