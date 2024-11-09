/**
 * 탑재 장비
 */
class Payload {
    weight: number;
    constructor(weight: number) {
        this.weight = weight;
    }
}

/**
 * 엔진
 */
class Engine {
    thrust: number;
    constructor(thrust: number) {
        this.thrust = thrust;
    }
}

/**
 * 스테이지, 단계
 */
class Stage {
    engines: Engine[];
    constructor(engines: Engine[]) {
        this.engines = engines;
    }
}

/**
 *
 * 팩토리 메서드 패턴
 * - 생성자 대신 팩토리의 추상 메서드를 사용하여 인스턴스를 생성
 * - 서브클래스에서 팩토리 메서드를 구현 or 재정의하여 인스턴스를 생성
 */

/**
 * 로켓 인터페이스
 */
interface Rocket {
    payload: Payload;
    stages: Stage[];
}

class BaseRocket implements Rocket {
    payload: Payload;
    stages: Stage[];
}

/**
 * 로켓 팩토리, Creator
 */
class RocketFactory {
    /**
     * 팩토리 메서드
     */
    buildRocket(): Rocket {
        const rocket = this.createRocket();
        rocket.payload = this.createPayload();
        rocket.stages = this.createStages();
        return rocket;
    }

    /**
     * 서브 클래스에서 재정의 해서 로켓 인스턴스를 바꿀 수 있음
     */
    createRocket(): Rocket {
        return new BaseRocket();
    }

    /**
     * 서브 클래스에서 재정의 해서 탑재 장비 인스턴스를 바꿀 수 있음
     */
    createPayload(): Payload {
        return new Payload(100);
    }

    /**
     * 서브 클래스에서 재정의 해서 스테이지 인스턴스를 바꿀 수 있음
     */
    createStages(): Stage[] {
        const stage = new Stage([new Engine(100)]);
        return [stage];
    }
}

// 이제 좀 더 확장된 기능이 있는 Rocket

class Satelite extends Payload {
    constructor(public id: string) {
        super(200);
    }
}

class FirstStage extends Stage {
    constructor() {
        super([new Engine(1000), new Engine(1000), new Engine(1000), new Engine(1000)]);
    }
}

class SecondStage extends Stage {
    constructor() {
        super([new Engine(1000)]);
    }
}

type FreightRocketStage = [FirstStage, SecondStage];

/**
 * Payload와 Stage가 변경된 Rocket을 생성하는 Factory
 */
class FreightRocketFactory extends RocketFactory {
    /**
     *오버 라이드
     */
    createPayload(): Satelite {
        return new Satelite("F1");
    }

    /**
     * 오버 라이드
     */
    createStages(): FreightRocketStage {
        return [new FirstStage(), new SecondStage()];
    }
}
