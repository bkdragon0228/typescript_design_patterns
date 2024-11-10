/**
 * 페이로드 인터페이스 - 로켓에 실리는 화물의 무게를 정의
 */
export interface Payload {
    weight: number;
}

/**
 * 엔진 인터페이스 - 로켓 엔진의 추진력을 정의
 */
export interface Engine {
    thrust: number;
}

/**
 * 스테이지 인터페이스 - 로켓의 각 단계에 포함된 엔진들을 정의
 */
export interface Stage {
    engines: Engine[];
}

/**
 * 로켓 인터페이스 - 기본적인 로켓의 구조를 정의
 */
export interface Rocket {
    payload: Payload;
}

/**
 * 탐사선 클래스 - 과학 실험용 페이로드
 */
export class Probe implements Payload {
    weight: number;
}

/**
 * 위성 클래스 - 궤도에 올릴 인공위성 페이로드
 */
export class Satellite implements Payload {
    constructor(public id: number, public weight: number) {}
}

/**
 * 고체 로켓 엔진 - 한번 점화하면 끌 수 없는 단순한 구조의 엔진
 */
export class SolidRocketEngine implements Engine {
    thrust: number;

    constructor(thrust: number) {
        this.thrust = thrust;
    }
}

/**
 * 탐사 로켓 - 단일 고체 로켓 엔진을 사용하는 간단한 구조의 로켓
 */
export class SoundingRocket implements Rocket {
    payload: Probe;
    engine: SolidRocketEngine;
}

/**
 * 액체 로켓 엔진 - 연료 주입이 가능하고 제어가 용이한 고성능 엔진
 */
export class LiquidRocketEngine implements Engine {
    thrust: number;
    fuelLevel = 0;

    constructor(thrust: number) {
        this.thrust = thrust;
    }

    refuel(level: number) {
        this.fuelLevel = level;
    }
}

/**
 * 액체 로켓 스테이지 - 여러 개의 액체 로켓 엔진을 포함하는 로켓 단계
 */
export abstract class LiquidRocketStage implements Stage {
    engines: LiquidRocketEngine[] = [];

    refuel(level = 100) {
        this.engines.forEach((engine) => engine.refuel(level));
    }
}

/**
 * 화물 로켓 1단계 - 4개의 강력한 엔진으로 초기 추진력 제공
 */
export class FreightRocketFirstStage extends LiquidRocketStage {
    constructor(thrust: number) {
        super();

        let engineNumber = 4;
        let signleEngineThrust = thrust / engineNumber;

        for (let i = 0; i < engineNumber; i++) {
            let engine = new LiquidRocketEngine(signleEngineThrust);
            this.engines.push(engine);
        }
    }
}

/**
 * 화물 로켓 2단계 - 단일 엔진으로 궤도 진입을 위한 추가 추진력 제공
 */
export class FreightRocketSecondStage extends LiquidRocketStage {
    constructor(thrust: number) {
        super();
        this.engines.push(new LiquidRocketEngine(thrust));
    }
}

/**
 * 화물 로켓의 1단계와 2단계를 정의하는 타입
 */
type FreightRocketStages = [FreightRocketFirstStage, FreightRocketSecondStage];

/**
 * 화물 로켓 - 위성을 궤도에 올리기 위한 2단계 로켓
 */
export class FreightRocket implements Rocket {
    payload: Satellite;
    stages: FreightRocketStages;
}

/**
 * 로켓 빌더 추상 클래스 - 로켓 조립 과정을 정의
 */
export abstract class RocketBuilder<TRocket extends Rocket, TPayload extends Payload> {
    createRocket(): void {}
    addPayload(payload: TPayload): void {}
    addStage(): void {}
    refuelRocket(): void {}
    abstract get rocket(): TRocket;
}

/**
 * 디렉터 클래스 - 빌더를 사용하여 로켓 조립 과정을 조정
 */
export class Director {
    prepareRocket<TRocket extends Rocket, TPayload extends Payload>(
        builder: RocketBuilder<TRocket, TPayload>,
        payload: TPayload
    ) {
        builder.createRocket();
        builder.addPayload(payload);
        builder.addStage();
        builder.refuelRocket();
        return builder.rocket;
    }
}

/**
 * 탐사 로켓 빌더 - 단순한 구조의 탐사 로켓을 조립
 * 연료 주입이 필요없는 고체 로켓 엔진 사용
 */
export class SoundingRocketBuilder extends RocketBuilder<SoundingRocket, Probe> {
    private buildingRocket: SoundingRocket;

    createRocket() {
        this.buildingRocket = new SoundingRocket();
    }

    addPayload(payload: Probe) {
        this.buildingRocket.payload = payload;
    }

    addStage() {
        let payload = this.buildingRocket.payload;
        this.buildingRocket.engine = new SolidRocketEngine(payload.weight);
    }

    get rocket() {
        return this.buildingRocket;
    }
}

/**
 * 화물 로켓 빌더 - 위성 발사용 2단계 로켓을 조립
 * 페이로드 무게에 따라 1단계 또는 2단계 구성이 달라짐
 */
export class FreightRocketBuilder extends RocketBuilder<FreightRocket, Satellite> {
    static oneStageMaxPayload = 1000;
    static twoStageMaxPayload = 2000;
    private buildingRocket: FreightRocket;

    createRocket() {
        this.buildingRocket = new FreightRocket();
    }

    addPayload(payload: Satellite) {
        this.buildingRocket.payload = payload;
    }

    addStage() {
        let rocket = this.buildingRocket;
        let payload = rocket.payload;
        let stages = rocket.stages;
        stages[0] = new FreightRocketFirstStage(payload.weight);

        if (payload.weight > FreightRocketBuilder.oneStageMaxPayload) {
            stages[1] = new FreightRocketSecondStage(payload.weight);
        }
    }

    refuelRocket() {
        let rocket = this.buildingRocket;
        let payload = rocket.payload;
        let stages = rocket.stages;

        let oneMax = FreightRocketBuilder.oneStageMaxPayload;
        let twoMax = FreightRocketBuilder.twoStageMaxPayload;

        let weight = payload.weight;

        stages[0].refuel((Math.min(weight, oneMax) / oneMax) * 100);

        if (weight > oneMax) {
            stages[1].refuel(((weight - oneMax) / (twoMax - oneMax)) * 100);
        }
    }

    get rocket() {
        return this.buildingRocket;
    }
}

// 클라이언트 코드 예시
let director = new Director();
let soundingRocket = director.prepareRocket(new SoundingRocketBuilder(), new Probe());
let freightRocket = director.prepareRocket(new FreightRocketBuilder(), new Satellite(1, 1500));
