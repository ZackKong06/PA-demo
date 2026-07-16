System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Button, Camera, Canvas, Color, Component, director, Graphics, HorizontalTextAlignment, input, Input, isValid, Label, Layers, Node, ResolutionPolicy, tween, UITransform, Vec3, VerticalTextAlignment, view, ProceduralFactory, _dec, _class, _crd, ccclass, GameState, PADemo;

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
      isValid = _cc.isValid;
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

      __checkObsolete__(['_decorator', 'Button', 'Camera', 'Canvas', 'Color', 'Component', 'director', 'EventMouse', 'EventTouch', 'Graphics', 'HorizontalTextAlignment', 'input', 'Input', 'isValid', 'Label', 'Layers', 'Node', 'ResolutionPolicy', 'tween', 'UITransform', 'Vec3', 'VerticalTextAlignment', 'view']);

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
          this.totalDistance = 95;
          this.fireInterval = 0.9;
          this.bulletDamage = 2;
          this.enemyDespawnZ = 7.5;
          this.positiveGateColor = new Color(65, 224, 145);
          this.negativeGateColor = new Color(238, 78, 91);
          this.state = GameState.READY;
          this.world = void 0;
          this.playerRoot = void 0;
          this.effectRoot = void 0;
          this.unitNodes = [];
          this.bullets = [];
          this.enemies = [];
          this.gates = [];
          this.roadStripes = [];
          this.unitFireTimers = new Map();
          this.squadCount = 3;
          this.playerX = 0;
          this.targetPlayerX = 0;
          this.distance = 0;
          this.elapsed = 0;
          this.endTimer = 0;
          this.dragging = false;
          this.lastPointerX = 0;
          this.boss = null;
          this.squadLabel = void 0;
          this.distanceLabel = void 0;
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
          this.bossPanel = void 0;
          this.bossHealthGraphics = void 0;
          this.toastNode = void 0;
          this.toastLabel = void 0;
          this.toastTimer = 0;
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
            this.distance += this.scrollSpeed * dt;
            this.updateRoad(dt);
            this.updateFiring(dt);
            this.updateBullets(dt);
            this.updateEnemies(dt);
            this.updateGates(dt);
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

          for (let i = 0; i < 34; i++) {
            const z = 3 - i * 5;
            const side = i % 2 === 0 ? -1 : 1;
            const block = this.factory.createBox('CityBlock', this.world, new Vec3(side * (4.4 + i % 3 * 0.5), 0.5 + i % 4 * 0.3, z), new Vec3(1.5, 1.2 + i % 4 * 0.6, 1.8), i % 2 === 0 ? new Color(31, 93, 104) : new Color(42, 72, 93));
            block.setRotationFromEuler(0, side * (5 + i % 4 * 4), 0);
          }
        }

        createPlayer() {
          this.playerRoot = new Node('Squad');
          this.playerRoot.setParent(this.world);
          this.playerRoot.setPosition(0, 0, this.playerZ);
          this.setSquadCount(this.squadCount);
        }

        createLevel() {
          this.spawnWave(-10, 4, 2, 0.75);
          this.spawnGate(-18, -10);
          this.spawnWave(-35, 8, 3, 0.8);
          this.spawnWave(-46, 12, 3, 0.9);
          this.spawnGate(-58, -70);
          this.spawnWave(-77, 35, 4, 1.0);
          this.spawnWave(-84.5, 35, 4, 1.05);
          this.spawnWave(-92, 40, 5, 1.1);
          this.spawnGate(-101, -50, 1.1);
          this.spawnBoss(-106);
        }

        spawnWave(z, count, hp, speed) {
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
              hp,
              maxHp: hp,
              speed,
              radius: 0.48,
              boss: false,
              alive: true,
              crossedPlayer: false,
              seed: i * 0.71 + Math.abs(z)
            });
          }
        }

        spawnGate(z, value, speed = 0) {
          const color = this.getGateColor(value);
          const node = this.factory.createGate(this.world, value, color);
          node.setPosition(0, 0, z);
          this.gates.push({
            node,
            value,
            displayedValue: value,
            color,
            speed,
            triggered: false
          });
        }

        getGateColor(value) {
          return value < 0 ? this.negativeGateColor : this.positiveGateColor;
        }

        spawnBoss(z) {
          const node = this.factory.createEnemy('Overlord', this.world, true);
          node.setPosition(0, 0, z);
          const boss = {
            node,
            hp: 500,
            maxHp: 500,
            speed: 0.45,
            radius: 1.25,
            boss: true,
            alive: true,
            crossedPlayer: false,
            seed: 99
          };
          this.enemies.push(boss);
          this.boss = boss;
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
          this.distanceLabel = this.createLabel(topPanel, 'Distance', '0%', 26, Color.WHITE, new Vec3(455, 8), 110, 46);
          this.createLabel(topPanel, 'Mission', 'REACH THE OVERLORD', 18, new Color(190, 204, 211), new Vec3(0, 10), 320, 40);
          const progressNode = new Node('Progress');
          progressNode.layer = Layers.Enum.UI_2D;
          progressNode.setParent(topPanel);
          progressNode.setPosition(0, -25);
          progressNode.addComponent(UITransform).setContentSize(760, 12);
          this.progressGraphics = progressNode.addComponent(Graphics);
          this.bossPanel = this.createPanel(canvasNode, 'Boss Panel', 620, 70, new Color(39, 19, 53, 225));
          this.bossPanel.setPosition(0, 215);
          this.createLabel(this.bossPanel, 'Boss Name', 'OVERLORD', 21, new Color(255, 221, 112), new Vec3(0, 17), 300, 32);
          const bossHealthNode = new Node('Boss Health');
          bossHealthNode.layer = Layers.Enum.UI_2D;
          bossHealthNode.setParent(this.bossPanel);
          bossHealthNode.setPosition(0, -20);
          bossHealthNode.addComponent(UITransform).setContentSize(500, 18);
          this.bossHealthGraphics = bossHealthNode.addComponent(Graphics);
          this.bossPanel.active = false;
          this.toastNode = this.createPanel(canvasNode, 'Toast', 430, 84, new Color(9, 35, 42, 235));
          this.toastNode.setPosition(0, 140);
          this.toastLabel = this.createLabel(this.toastNode, 'Toast Label', '', 30, new Color(115, 242, 255), new Vec3(), 390, 60);
          this.toastNode.active = false;
          this.startOverlayNode = this.createFullscreenOverlay(canvasNode, 'Start Overlay', new Color(7, 18, 24, 172));
          this.createLabel(this.startOverlayNode, 'Title', 'SQUAD RUSH', 64, new Color(105, 239, 255), new Vec3(0, 115), 760, 90);
          this.createLabel(this.startOverlayNode, 'Subtitle', 'BREAK THE LINE', 25, new Color(255, 215, 108), new Vec3(0, 55), 560, 45);
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
          for (const stripe of this.roadStripes) {
            const position = stripe.position;
            let z = position.z + this.scrollSpeed * dt;

            if (z > 7) {
              z -= 164;
            }

            stripe.setPosition(position.x, position.y, z);
          }
        }

        updateFiring(dt) {
          for (let i = 0; i < this.unitNodes.length; i++) {
            var _this$unitFireTimers$;

            const unit = this.unitNodes[i];
            const interval = this.fireInterval + i % 5 * 0.025;
            let timer = ((_this$unitFireTimers$ = this.unitFireTimers.get(unit)) != null ? _this$unitFireTimers$ : 0) + dt;

            if (timer >= interval) {
              timer %= interval;
              const worldPosition = unit.worldPosition;
              this.spawnBullet(worldPosition.x, worldPosition.z - 0.72);
            }

            this.unitFireTimers.set(unit, timer);
          }
        }

        spawnBullet(x, z) {
          const node = this.factory.createCylinder('Pulse', this.world, new Vec3(x, 0.78, z), new Vec3(0.11, 0.72, 0.11), new Color(95, 242, 255));
          node.setRotationFromEuler(90, 0, 0);
          this.bullets.push({
            node,
            damage: this.bulletDamage
          });
        }

        updateBullets(dt) {
          const bulletSpeed = 18;

          for (const bullet of this.bullets) {
            if (!isValid(bullet.node, true)) {
              continue;
            }

            const position = bullet.node.position;
            const previousZ = position.z;
            const nextZ = previousZ - bulletSpeed * dt;
            bullet.node.setPosition(position.x, position.y, nextZ);
            let consumed = false;

            for (const gate of this.gates) {
              const gateZ = gate.node.position.z;
              const crossesGate = gateZ <= previousZ + 0.35 && gateZ >= nextZ - 0.35;

              if (!gate.triggered && crossesGate && Math.abs(gate.node.position.x - bullet.node.position.x) <= 2.7) {
                gate.value += 1;
                gate.color = this.getGateColor(gate.value);
                this.spawnImpact(new Vec3(bullet.node.position.x, 1.2, gateZ), gate.color);
                consumed = true;
                break;
              }
            }

            if (!consumed) {
              for (const enemy of this.enemies) {
                if (!enemy.alive || Math.abs(enemy.node.position.z - bullet.node.position.z) > enemy.radius + 0.35) {
                  continue;
                }

                if (Math.abs(enemy.node.position.x - bullet.node.position.x) <= enemy.radius) {
                  this.damageEnemy(enemy, bullet.damage);
                  consumed = true;
                  break;
                }
              }
            }

            if (consumed || bullet.node.position.z < -105) {
              bullet.node.destroy();
            }
          }

          for (const gate of this.gates) {
            if (!gate.triggered && gate.displayedValue !== gate.value) {
              this.factory.updateGateValue(gate.node, gate.value, gate.color);
              gate.displayedValue = gate.value;
            }
          }

          this.bullets = this.bullets.filter(bullet => isValid(bullet.node, true));
        }

        damageEnemy(enemy, damage) {
          if (enemy.boss) {
            this.bossPanel.active = true;
          }

          enemy.hp = enemy.boss ? enemy.hp - damage : 0;
          this.spawnImpact(enemy.node.position, enemy.boss ? new Color(255, 214, 92) : new Color(255, 105, 110));

          if (enemy.hp <= 0) {
            enemy.alive = false;
            this.spawnBurst(enemy.node.position, enemy.boss ? new Color(168, 92, 232) : new Color(238, 76, 86), enemy.boss ? 1.8 : 0.8);
            enemy.node.destroy();

            if (enemy.boss) {
              this.finish(GameState.WIN);
            }
          }
        }

        updateEnemies(dt) {
          for (const enemy of this.enemies) {
            if (!enemy.alive) {
              continue;
            }

            const position = enemy.node.position;
            const z = position.z + (this.scrollSpeed + enemy.speed) * dt;
            const sway = enemy.boss ? Math.sin(this.elapsed * 1.4) * 0.55 : Math.sin(this.elapsed * 2.2 + enemy.seed) * 0.08;
            const x = position.x + sway * dt;
            enemy.node.setPosition(x, Math.abs(Math.sin(this.elapsed * 5 + enemy.seed)) * 0.04, z);
            enemy.node.setRotationFromEuler(0, 180, Math.sin(this.elapsed * 5 + enemy.seed) * 3);
            const playerLine = this.playerZ - (enemy.boss ? 1.5 : 0.45);

            if (!enemy.crossedPlayer && z >= playerLine) {
              enemy.crossedPlayer = true;
              const touchesSquad = Math.abs(x - this.playerX) <= enemy.radius + this.getSquadHalfWidth();

              if (touchesSquad) {
                this.spawnBurst(new Vec3(x, 0.7, this.playerZ), new Color(242, 94, 100), enemy.boss ? 1.5 : 0.65);
                this.removeSquad(enemy.boss ? Math.max(5, Math.ceil(this.squadCount * 0.65)) : 1);
              }

              if (enemy.boss && this.state === GameState.PLAYING) {
                this.finish(GameState.LOSE);
              }
            }

            if (z >= this.enemyDespawnZ) {
              enemy.alive = false;
              enemy.node.destroy();
            }
          }

          this.enemies = this.enemies.filter(enemy => enemy.alive);
        }

        getSquadHalfWidth() {
          let halfWidth = 0.3;

          for (const unit of this.unitNodes) {
            halfWidth = Math.max(halfWidth, Math.abs(unit.position.x) + 0.25);
          }

          return halfWidth;
        }

        updateGates(dt) {
          for (const gate of this.gates) {
            if (gate.triggered) {
              continue;
            }

            const position = gate.node.position;
            gate.node.setPosition(position.x, position.y, position.z + (this.scrollSpeed + gate.speed) * dt);

            if (gate.node.position.z >= this.playerZ - 0.3) {
              gate.triggered = true;

              if (gate.value >= 0) {
                this.addSquad(gate.value);
              } else {
                this.removeSquad(Math.abs(gate.value));
              }

              const signedValue = gate.value >= 0 ? `+${gate.value}` : `${gate.value}`;
              this.showToast(`SQUAD  ${signedValue}`, gate.color);
              this.spawnBurst(new Vec3(this.playerX, 1, this.playerZ), gate.color, 1.15);
              gate.node.destroy();
            }
          }

          this.gates = this.gates.filter(gate => !gate.triggered);
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
            this.unitFireTimers.set(unit, index * 0.13 % this.fireInterval);
          }

          while (this.unitNodes.length > this.squadCount) {
            const unit = this.unitNodes.pop();

            if (unit) {
              this.unitFireTimers.delete(unit);
            }

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
          const progress = Math.max(0, Math.min(1, this.distance / this.totalDistance));
          this.distanceLabel.string = `${Math.floor(progress * 100)}%`;
          this.drawBar(this.progressGraphics, 760, 12, progress, new Color(77, 227, 201), new Color(42, 58, 65));

          if (this.boss && this.boss.alive) {
            this.drawBar(this.bossHealthGraphics, 500, 18, Math.max(0, this.boss.hp / this.boss.maxHp), new Color(228, 80, 116), new Color(61, 38, 66));
          }
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
          this.subtitleLabel.string = won ? 'OVERLORD DEFEATED' : 'THE LINE WAS BROKEN';
          const progressPercent = Math.min(100, Math.floor(this.distance / this.totalDistance * 100));
          this.resultLabel.string = won ? 'THE CITY IS SAFE' : `SQUAD LOST  -  ${progressPercent}%`;
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
//# sourceMappingURL=d26ae2febfc1a3ab44fafa949826d823b615cc7e.js.map