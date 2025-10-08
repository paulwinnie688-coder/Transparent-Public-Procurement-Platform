import { describe, it, expect, beforeEach } from "vitest";
import { stringUtf8CV, uintCV } from "@stacks/transactions";

const ERR_NOT_AUTHORIZED = 100;
const ERR_INVALID_DESCRIPTION = 101;
const ERR_INVALID_BUDGET = 102;
const ERR_INVALID_DEADLINE = 103;
const ERR_INVALID_START_DATE = 104;
const ERR_INVALID_EVAL_CRITERIA = 105;
const ERR_PROCUREMENT_ALREADY_EXISTS = 106;
const ERR_PROCUREMENT_NOT_FOUND = 107;
const ERR_INVALID_PROCUREMENT_TYPE = 115;
const ERR_INVALID_LOCATION = 116;
const ERR_INVALID_CURRENCY = 117;
const ERR_INVALID_STATUS = 118;
const ERR_INVALID_MIN_BID = 110;
const ERR_INVALID_MAX_BID = 111;
const ERR_MAX_PROCUREMENTS_EXCEEDED = 114;
const ERR_INVALID_UPDATE_PARAM = 113;
const ERR_AUTHORITY_NOT_VERIFIED = 109;
const ERR_INVALID_DEPARTMENT = 119;
const ERR_INVALID_CATEGORY = 120;
const ERR_INVALID_QUANTITY = 121;
const ERR_INVALID_UNIT = 122;
const ERR_INVALID_DELIVERY_TIME = 123;
const ERR_INVALID_PAYMENT_TERMS = 124;
const ERR_INVALID_WARRANTY_PERIOD = 125;

interface Procurement {
  title: string;
  description: string;
  budget: number;
  deadline: number;
  startDate: number;
  evalCriteria: string;
  timestamp: number;
  creator: string;
  procurementType: string;
  location: string;
  currency: string;
  status: string;
  minBid: number;
  maxBid: number;
  department: string;
  category: string;
  quantity: number;
  unit: string;
  deliveryTime: number;
  paymentTerms: string;
  warrantyPeriod: number;
}

interface ProcurementUpdate {
  updateTitle: string;
  updateDescription: string;
  updateBudget: number;
  updateTimestamp: number;
  updater: string;
}

interface Result<T> {
  ok: boolean;
  value: T;
}

class ProcurementRegistryMock {
  state: {
    nextProcurementId: number;
    maxProcurements: number;
    creationFee: number;
    authorityContract: string | null;
    procurements: Map<number, Procurement>;
    procurementUpdates: Map<number, ProcurementUpdate>;
    procurementsByTitle: Map<string, number>;
  } = {
    nextProcurementId: 0,
    maxProcurements: 10000,
    creationFee: 5000,
    authorityContract: null,
    procurements: new Map(),
    procurementUpdates: new Map(),
    procurementsByTitle: new Map(),
  };
  blockHeight: number = 0;
  caller: string = "ST1TEST";
  authorities: Set<string> = new Set(["ST1TEST"]);
  stxTransfers: Array<{ amount: number; from: string; to: string | null }> = [];

  constructor() {
    this.reset();
  }

  reset() {
    this.state = {
      nextProcurementId: 0,
      maxProcurements: 10000,
      creationFee: 5000,
      authorityContract: null,
      procurements: new Map(),
      procurementUpdates: new Map(),
      procurementsByTitle: new Map(),
    };
    this.blockHeight = 0;
    this.caller = "ST1TEST";
    this.authorities = new Set(["ST1TEST"]);
    this.stxTransfers = [];
  }

  isVerifiedAuthority(principal: string): Result<boolean> {
    return { ok: true, value: this.authorities.has(principal) };
  }

  setAuthorityContract(contractPrincipal: string): Result<boolean> {
    if (contractPrincipal === "SP000000000000000000002Q6VF78") {
      return { ok: false, value: false };
    }
    if (this.state.authorityContract !== null) {
      return { ok: false, value: false };
    }
    this.state.authorityContract = contractPrincipal;
    return { ok: true, value: true };
  }

  setCreationFee(newFee: number): Result<boolean> {
    if (!this.state.authorityContract) return { ok: false, value: false };
    this.state.creationFee = newFee;
    return { ok: true, value: true };
  }

  createProcurement(
    title: string,
    description: string,
    budget: number,
    deadline: number,
    startDate: number,
    evalCriteria: string,
    procurementType: string,
    location: string,
    currency: string,
    minBid: number,
    maxBid: number,
    department: string,
    category: string,
    quantity: number,
    unit: string,
    deliveryTime: number,
    paymentTerms: string,
    warrantyPeriod: number
  ): Result<number> {
    if (this.state.nextProcurementId >= this.state.maxProcurements) return { ok: false, value: ERR_MAX_PROCUREMENTS_EXCEEDED };
    if (!title || title.length > 200) return { ok: false, value: ERR_INVALID_UPDATE_PARAM };
    if (!description || description.length > 1000) return { ok: false, value: ERR_INVALID_DESCRIPTION };
    if (budget <= 0) return { ok: false, value: ERR_INVALID_BUDGET };
    if (deadline <= this.blockHeight) return { ok: false, value: ERR_INVALID_DEADLINE };
    if (startDate < this.blockHeight) return { ok: false, value: ERR_INVALID_START_DATE };
    if (!evalCriteria || evalCriteria.length > 500) return { ok: false, value: ERR_INVALID_EVAL_CRITERIA };
    if (!["goods", "services", "works"].includes(procurementType)) return { ok: false, value: ERR_INVALID_PROCUREMENT_TYPE };
    if (!location || location.length > 100) return { ok: false, value: ERR_INVALID_LOCATION };
    if (!["STX", "USD", "BTC"].includes(currency)) return { ok: false, value: ERR_INVALID_CURRENCY };
    if (minBid <= 0) return { ok: false, value: ERR_INVALID_MIN_BID };
    if (maxBid <= 0) return { ok: false, value: ERR_INVALID_MAX_BID };
    if (!department || department.length > 100) return { ok: false, value: ERR_INVALID_DEPARTMENT };
    if (!category || category.length > 100) return { ok: false, value: ERR_INVALID_CATEGORY };
    if (quantity <= 0) return { ok: false, value: ERR_INVALID_QUANTITY };
    if (!unit || unit.length > 50) return { ok: false, value: ERR_INVALID_UNIT };
    if (deliveryTime <= 0) return { ok: false, value: ERR_INVALID_DELIVERY_TIME };
    if (!paymentTerms || paymentTerms.length > 200) return { ok: false, value: ERR_INVALID_PAYMENT_TERMS };
    if (warrantyPeriod < 0) return { ok: false, value: ERR_INVALID_WARRANTY_PERIOD };
    if (!this.isVerifiedAuthority(this.caller).value) return { ok: false, value: ERR_NOT_AUTHORIZED };
    if (this.state.procurementsByTitle.has(title)) return { ok: false, value: ERR_PROCUREMENT_ALREADY_EXISTS };
    if (!this.state.authorityContract) return { ok: false, value: ERR_AUTHORITY_NOT_VERIFIED };

    this.stxTransfers.push({ amount: this.state.creationFee, from: this.caller, to: this.state.authorityContract });

    const id = this.state.nextProcurementId;
    const procurement: Procurement = {
      title,
      description,
      budget,
      deadline,
      startDate,
      evalCriteria,
      timestamp: this.blockHeight,
      creator: this.caller,
      procurementType,
      location,
      currency,
      status: "open",
      minBid,
      maxBid,
      department,
      category,
      quantity,
      unit,
      deliveryTime,
      paymentTerms,
      warrantyPeriod,
    };
    this.state.procurements.set(id, procurement);
    this.state.procurementsByTitle.set(title, id);
    this.state.nextProcurementId++;
    return { ok: true, value: id };
  }

  getProcurement(id: number): Procurement | null {
    return this.state.procurements.get(id) || null;
  }

  updateProcurement(id: number, updateTitle: string, updateDescription: string, updateBudget: number): Result<boolean> {
    const procurement = this.state.procurements.get(id);
    if (!procurement) return { ok: false, value: false };
    if (procurement.creator !== this.caller) return { ok: false, value: false };
    if (!updateTitle || updateTitle.length > 200) return { ok: false, value: false };
    if (!updateDescription || updateDescription.length > 1000) return { ok: false, value: false };
    if (updateBudget <= 0) return { ok: false, value: false };
    if (this.state.procurementsByTitle.has(updateTitle) && this.state.procurementsByTitle.get(updateTitle) !== id) {
      return { ok: false, value: false };
    }

    const updated: Procurement = {
      ...procurement,
      title: updateTitle,
      description: updateDescription,
      budget: updateBudget,
      timestamp: this.blockHeight,
    };
    this.state.procurements.set(id, updated);
    this.state.procurementsByTitle.delete(procurement.title);
    this.state.procurementsByTitle.set(updateTitle, id);
    this.state.procurementUpdates.set(id, {
      updateTitle,
      updateDescription,
      updateBudget,
      updateTimestamp: this.blockHeight,
      updater: this.caller,
    });
    return { ok: true, value: true };
  }

  closeProcurement(id: number): Result<boolean> {
    const procurement = this.state.procurements.get(id);
    if (!procurement) return { ok: false, value: false };
    if (procurement.creator !== this.caller) return { ok: false, value: false };
    if (procurement.status !== "open") return { ok: false, value: false };
    procurement.status = "closed";
    this.state.procurements.set(id, procurement);
    return { ok: true, value: true };
  }

  getProcurementCount(): Result<number> {
    return { ok: true, value: this.state.nextProcurementId };
  }

  checkProcurementExistence(title: string): Result<boolean> {
    return { ok: true, value: this.state.procurementsByTitle.has(title) };
  }
}

describe("ProcurementRegistry", () => {
  let contract: ProcurementRegistryMock;

  beforeEach(() => {
    contract = new ProcurementRegistryMock();
    contract.reset();
  });

  it("creates a procurement successfully", () => {
    contract.setAuthorityContract("ST2TEST");
    const result = contract.createProcurement(
      "Proc1",
      "Description1",
      1000,
      100,
      50,
      "Criteria1",
      "goods",
      "Location1",
      "STX",
      500,
      1500,
      "Dept1",
      "Cat1",
      10,
      "units",
      30,
      "Terms1",
      12
    );
    expect(result.ok).toBe(true);
    expect(result.value).toBe(0);

    const proc = contract.getProcurement(0);
    expect(proc?.title).toBe("Proc1");
    expect(proc?.description).toBe("Description1");
    expect(proc?.budget).toBe(1000);
    expect(proc?.deadline).toBe(100);
    expect(proc?.startDate).toBe(50);
    expect(proc?.evalCriteria).toBe("Criteria1");
    expect(proc?.procurementType).toBe("goods");
    expect(proc?.location).toBe("Location1");
    expect(proc?.currency).toBe("STX");
    expect(proc?.status).toBe("open");
    expect(proc?.minBid).toBe(500);
    expect(proc?.maxBid).toBe(1500);
    expect(proc?.department).toBe("Dept1");
    expect(proc?.category).toBe("Cat1");
    expect(proc?.quantity).toBe(10);
    expect(proc?.unit).toBe("units");
    expect(proc?.deliveryTime).toBe(30);
    expect(proc?.paymentTerms).toBe("Terms1");
    expect(proc?.warrantyPeriod).toBe(12);
    expect(contract.stxTransfers).toEqual([{ amount: 5000, from: "ST1TEST", to: "ST2TEST" }]);
  });

  it("rejects duplicate procurement titles", () => {
    contract.setAuthorityContract("ST2TEST");
    contract.createProcurement(
      "Proc1",
      "Description1",
      1000,
      100,
      50,
      "Criteria1",
      "goods",
      "Location1",
      "STX",
      500,
      1500,
      "Dept1",
      "Cat1",
      10,
      "units",
      30,
      "Terms1",
      12
    );
    const result = contract.createProcurement(
      "Proc1",
      "Description2",
      2000,
      200,
      100,
      "Criteria2",
      "services",
      "Location2",
      "USD",
      1000,
      3000,
      "Dept2",
      "Cat2",
      20,
      "pieces",
      60,
      "Terms2",
      24
    );
    expect(result.ok).toBe(false);
    expect(result.value).toBe(ERR_PROCUREMENT_ALREADY_EXISTS);
  });

  it("rejects non-authorized caller", () => {
    contract.setAuthorityContract("ST2TEST");
    contract.caller = "ST2FAKE";
    contract.authorities = new Set();
    const result = contract.createProcurement(
      "Proc2",
      "Description1",
      1000,
      100,
      50,
      "Criteria1",
      "goods",
      "Location1",
      "STX",
      500,
      1500,
      "Dept1",
      "Cat1",
      10,
      "units",
      30,
      "Terms1",
      12
    );
    expect(result.ok).toBe(false);
    expect(result.value).toBe(ERR_NOT_AUTHORIZED);
  });

  it("rejects procurement creation without authority contract", () => {
    const result = contract.createProcurement(
      "NoAuth",
      "Description1",
      1000,
      100,
      50,
      "Criteria1",
      "goods",
      "Location1",
      "STX",
      500,
      1500,
      "Dept1",
      "Cat1",
      10,
      "units",
      30,
      "Terms1",
      12
    );
    expect(result.ok).toBe(false);
    expect(result.value).toBe(ERR_AUTHORITY_NOT_VERIFIED);
  });

  it("rejects invalid budget", () => {
    contract.setAuthorityContract("ST2TEST");
    const result = contract.createProcurement(
      "InvalidBudget",
      "Description1",
      0,
      100,
      50,
      "Criteria1",
      "goods",
      "Location1",
      "STX",
      500,
      1500,
      "Dept1",
      "Cat1",
      10,
      "units",
      30,
      "Terms1",
      12
    );
    expect(result.ok).toBe(false);
    expect(result.value).toBe(ERR_INVALID_BUDGET);
  });

  it("rejects invalid deadline", () => {
    contract.setAuthorityContract("ST2TEST");
    const result = contract.createProcurement(
      "InvalidDeadline",
      "Description1",
      1000,
      0,
      50,
      "Criteria1",
      "goods",
      "Location1",
      "STX",
      500,
      1500,
      "Dept1",
      "Cat1",
      10,
      "units",
      30,
      "Terms1",
      12
    );
    expect(result.ok).toBe(false);
    expect(result.value).toBe(ERR_INVALID_DEADLINE);
  });

  it("rejects invalid procurement type", () => {
    contract.setAuthorityContract("ST2TEST");
    const result = contract.createProcurement(
      "InvalidType",
      "Description1",
      1000,
      100,
      50,
      "Criteria1",
      "invalid",
      "Location1",
      "STX",
      500,
      1500,
      "Dept1",
      "Cat1",
      10,
      "units",
      30,
      "Terms1",
      12
    );
    expect(result.ok).toBe(false);
    expect(result.value).toBe(ERR_INVALID_PROCUREMENT_TYPE);
  });

  it("updates a procurement successfully", () => {
    contract.setAuthorityContract("ST2TEST");
    contract.createProcurement(
      "OldProc",
      "OldDesc",
      1000,
      100,
      50,
      "Criteria1",
      "goods",
      "Location1",
      "STX",
      500,
      1500,
      "Dept1",
      "Cat1",
      10,
      "units",
      30,
      "Terms1",
      12
    );
    const result = contract.updateProcurement(0, "NewProc", "NewDesc", 2000);
    expect(result.ok).toBe(true);
    expect(result.value).toBe(true);
    const proc = contract.getProcurement(0);
    expect(proc?.title).toBe("NewProc");
    expect(proc?.description).toBe("NewDesc");
    expect(proc?.budget).toBe(2000);
    const update = contract.state.procurementUpdates.get(0);
    expect(update?.updateTitle).toBe("NewProc");
    expect(update?.updateDescription).toBe("NewDesc");
    expect(update?.updateBudget).toBe(2000);
    expect(update?.updater).toBe("ST1TEST");
  });

  it("rejects update for non-existent procurement", () => {
    contract.setAuthorityContract("ST2TEST");
    const result = contract.updateProcurement(99, "NewProc", "NewDesc", 2000);
    expect(result.ok).toBe(false);
    expect(result.value).toBe(false);
  });

  it("rejects update by non-creator", () => {
    contract.setAuthorityContract("ST2TEST");
    contract.createProcurement(
      "TestProc",
      "Description1",
      1000,
      100,
      50,
      "Criteria1",
      "goods",
      "Location1",
      "STX",
      500,
      1500,
      "Dept1",
      "Cat1",
      10,
      "units",
      30,
      "Terms1",
      12
    );
    contract.caller = "ST3FAKE";
    const result = contract.updateProcurement(0, "NewProc", "NewDesc", 2000);
    expect(result.ok).toBe(false);
    expect(result.value).toBe(false);
  });

  it("closes a procurement successfully", () => {
    contract.setAuthorityContract("ST2TEST");
    contract.createProcurement(
      "TestProc",
      "Description1",
      1000,
      100,
      50,
      "Criteria1",
      "goods",
      "Location1",
      "STX",
      500,
      1500,
      "Dept1",
      "Cat1",
      10,
      "units",
      30,
      "Terms1",
      12
    );
    const result = contract.closeProcurement(0);
    expect(result.ok).toBe(true);
    expect(result.value).toBe(true);
    const proc = contract.getProcurement(0);
    expect(proc?.status).toBe("closed");
  });

  it("rejects closing non-open procurement", () => {
    contract.setAuthorityContract("ST2TEST");
    contract.createProcurement(
      "TestProc",
      "Description1",
      1000,
      100,
      50,
      "Criteria1",
      "goods",
      "Location1",
      "STX",
      500,
      1500,
      "Dept1",
      "Cat1",
      10,
      "units",
      30,
      "Terms1",
      12
    );
    contract.closeProcurement(0);
    const result = contract.closeProcurement(0);
    expect(result.ok).toBe(false);
    expect(result.value).toBe(false);
  });

  it("sets creation fee successfully", () => {
    contract.setAuthorityContract("ST2TEST");
    const result = contract.setCreationFee(10000);
    expect(result.ok).toBe(true);
    expect(result.value).toBe(true);
    expect(contract.state.creationFee).toBe(10000);
    contract.createProcurement(
      "TestProc",
      "Description1",
      1000,
      100,
      50,
      "Criteria1",
      "goods",
      "Location1",
      "STX",
      500,
      1500,
      "Dept1",
      "Cat1",
      10,
      "units",
      30,
      "Terms1",
      12
    );
    expect(contract.stxTransfers).toEqual([{ amount: 10000, from: "ST1TEST", to: "ST2TEST" }]);
  });

  it("rejects creation fee change without authority contract", () => {
    const result = contract.setCreationFee(10000);
    expect(result.ok).toBe(false);
    expect(result.value).toBe(false);
  });

  it("returns correct procurement count", () => {
    contract.setAuthorityContract("ST2TEST");
    contract.createProcurement(
      "Proc1",
      "Description1",
      1000,
      100,
      50,
      "Criteria1",
      "goods",
      "Location1",
      "STX",
      500,
      1500,
      "Dept1",
      "Cat1",
      10,
      "units",
      30,
      "Terms1",
      12
    );
    contract.createProcurement(
      "Proc2",
      "Description2",
      2000,
      200,
      100,
      "Criteria2",
      "services",
      "Location2",
      "USD",
      1000,
      3000,
      "Dept2",
      "Cat2",
      20,
      "pieces",
      60,
      "Terms2",
      24
    );
    const result = contract.getProcurementCount();
    expect(result.ok).toBe(true);
    expect(result.value).toBe(2);
  });

  it("checks procurement existence correctly", () => {
    contract.setAuthorityContract("ST2TEST");
    contract.createProcurement(
      "TestProc",
      "Description1",
      1000,
      100,
      50,
      "Criteria1",
      "goods",
      "Location1",
      "STX",
      500,
      1500,
      "Dept1",
      "Cat1",
      10,
      "units",
      30,
      "Terms1",
      12
    );
    const result = contract.checkProcurementExistence("TestProc");
    expect(result.ok).toBe(true);
    expect(result.value).toBe(true);
    const result2 = contract.checkProcurementExistence("NonExistent");
    expect(result2.ok).toBe(true);
    expect(result2.value).toBe(false);
  });

  it("parses procurement parameters with Clarity types", () => {
    const title = stringUtf8CV("TestProc");
    const budget = uintCV(1000);
    expect(title.value).toBe("TestProc");
    expect(budget.value).toEqual(BigInt(1000));
  });

  it("rejects procurement creation with empty title", () => {
    contract.setAuthorityContract("ST2TEST");
    const result = contract.createProcurement(
      "",
      "Description1",
      1000,
      100,
      50,
      "Criteria1",
      "goods",
      "Location1",
      "STX",
      500,
      1500,
      "Dept1",
      "Cat1",
      10,
      "units",
      30,
      "Terms1",
      12
    );
    expect(result.ok).toBe(false);
    expect(result.value).toBe(ERR_INVALID_UPDATE_PARAM);
  });

  it("rejects procurement creation with max procurements exceeded", () => {
    contract.setAuthorityContract("ST2TEST");
    contract.state.maxProcurements = 1;
    contract.createProcurement(
      "Proc1",
      "Description1",
      1000,
      100,
      50,
      "Criteria1",
      "goods",
      "Location1",
      "STX",
      500,
      1500,
      "Dept1",
      "Cat1",
      10,
      "units",
      30,
      "Terms1",
      12
    );
    const result = contract.createProcurement(
      "Proc2",
      "Description2",
      2000,
      200,
      100,
      "Criteria2",
      "services",
      "Location2",
      "USD",
      1000,
      3000,
      "Dept2",
      "Cat2",
      20,
      "pieces",
      60,
      "Terms2",
      24
    );
    expect(result.ok).toBe(false);
    expect(result.value).toBe(ERR_MAX_PROCUREMENTS_EXCEEDED);
  });

  it("sets authority contract successfully", () => {
    const result = contract.setAuthorityContract("ST2TEST");
    expect(result.ok).toBe(true);
    expect(result.value).toBe(true);
    expect(contract.state.authorityContract).toBe("ST2TEST");
  });

  it("rejects invalid authority contract", () => {
    const result = contract.setAuthorityContract("SP000000000000000000002Q6VF78");
    expect(result.ok).toBe(false);
    expect(result.value).toBe(false);
  });
});