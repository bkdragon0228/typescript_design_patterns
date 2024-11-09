export interface Payload {
    weight: number;
}

export interface Engine {
    thrust: number;
}

export interface Stage {
    engines: Engine[];
}

export interface Rocket {
    payload: Payload;
    stages: Stage[];
}

/**
 * 추상 팩토리 패턴은 구체적인 제품을 지정하지 않는다.
 * 제품 자체를 유연하게 바꿀 수 있다.
 */
export interface RocketFactory<T extends Rocket> {
    createRocket(): T;
    createPayload(): Payload;
    createStage(): Stage[];
}

/**
 * 팩토리 클래스는 구성요소에 집중하고 재품 생상을 client 에서
 */
export class Client {
    buildRocket<T extends Rocket>(factory: RocketFactory<T>): T {
        const rocket = factory.createRocket();
        rocket.payload = factory.createPayload();
        rocket.stages = factory.createStage();
        return rocket;
    }
}

// 여기까지가 준비

// 1번 제품
export class ExperimentalRocket implements Rocket {
    payload: Payload;
    stages: Stage[];

    shoot() {
        console.log("Shooting");
    }
}

export class ExperimentalPayload implements Payload {
    weight: number;
}

export class ExperimentalStage implements Stage {
    engines: Engine[];
}

export class ExperimentalRocketFactory implements RocketFactory<ExperimentalRocket> {
    createRocket(): ExperimentalRocket {
        return new ExperimentalRocket();
    }

    createPayload(): ExperimentalPayload {
        return new ExperimentalPayload();
    }

    createStage(): ExperimentalStage[] {
        return [new ExperimentalStage()];
    }
}

const client = new Client();
const experimentalRocket = client.buildRocket(new ExperimentalRocketFactory());

experimentalRocket.shoot();

// 2번 제품

export class Satellite implements Payload {
    constructor(public id: number, public weight: number) {}
}

export class FreightRocketFirstStage implements Stage {
    engines: Engine[];
}

export class FreightRocketSecondStage implements Stage {
    engines: Engine[];
}

export type FreightRocketStage = [FreightRocketFirstStage, FreightRocketSecondStage];

export class FreightRocket implements Rocket {
    payload: Satellite;
    stages: FreightRocketStage;

    fly() {
        console.log("Flying");
    }
}

export class FreightRocketFactory implements RocketFactory<FreightRocket> {
    createRocket(): FreightRocket {
        return new FreightRocket();
    }

    createPayload(): Satellite {
        return new Satellite(1, 1000);
    }

    createStage(): FreightRocketStage {
        return [new FreightRocketFirstStage(), new FreightRocketSecondStage()];
    }
}

const freightRocket = client.buildRocket(new FreightRocketFactory());

freightRocket.fly();

// 그냥 Factory 패턴은 제품의 타입이 항상 Rocket 이였다.
