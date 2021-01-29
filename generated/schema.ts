// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class SIGHBoosters extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save SIGHBoosters entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save SIGHBoosters entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("SIGHBoosters", id.toString(), this);
  }

  static load(id: string): SIGHBoosters | null {
    return store.get("SIGHBoosters", id) as SIGHBoosters | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get name(): string {
    let value = this.get("name");
    return value.toString();
  }

  set name(value: string) {
    this.set("name", Value.fromString(value));
  }

  get symbol(): string {
    let value = this.get("symbol");
    return value.toString();
  }

  set symbol(value: string) {
    this.set("symbol", Value.fromString(value));
  }

  get baseURI(): string {
    let value = this.get("baseURI");
    return value.toString();
  }

  set baseURI(value: string) {
    this.set("baseURI", Value.fromString(value));
  }

  get adminAddress(): Bytes {
    let value = this.get("adminAddress");
    return value.toBytes();
  }

  set adminAddress(value: Bytes) {
    this.set("adminAddress", Value.fromBytes(value));
  }

  get categories(): Array<string> | null {
    let value = this.get("categories");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set categories(value: Array<string> | null) {
    if (value === null) {
      this.unset("categories");
    } else {
      this.set("categories", Value.fromStringArray(value as Array<string>));
    }
  }

  get boosters(): Array<string> | null {
    let value = this.get("boosters");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set boosters(value: Array<string> | null) {
    if (value === null) {
      this.unset("boosters");
    } else {
      this.set("boosters", Value.fromStringArray(value as Array<string>));
    }
  }

  get totalBoosters(): BigInt {
    let value = this.get("totalBoosters");
    return value.toBigInt();
  }

  set totalBoosters(value: BigInt) {
    this.set("totalBoosters", Value.fromBigInt(value));
  }
}

export class BoosterCategory extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save BoosterCategory entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save BoosterCategory entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("BoosterCategory", id.toString(), this);
  }

  static load(id: string): BoosterCategory | null {
    return store.get("BoosterCategory", id) as BoosterCategory | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get name(): string {
    let value = this.get("name");
    return value.toString();
  }

  set name(value: string) {
    this.set("name", Value.fromString(value));
  }

  get boostersList(): Array<string> {
    let value = this.get("boostersList");
    return value.toStringArray();
  }

  set boostersList(value: Array<string>) {
    this.set("boostersList", Value.fromStringArray(value));
  }

  get platformDiscountPercent(): BigDecimal {
    let value = this.get("platformDiscountPercent");
    return value.toBigDecimal();
  }

  set platformDiscountPercent(value: BigDecimal) {
    this.set("platformDiscountPercent", Value.fromBigDecimal(value));
  }

  get reserveFeeDiscountPercent(): BigDecimal {
    let value = this.get("reserveFeeDiscountPercent");
    return value.toBigDecimal();
  }

  set reserveFeeDiscountPercent(value: BigDecimal) {
    this.set("reserveFeeDiscountPercent", Value.fromBigDecimal(value));
  }

  get totalBoosters(): BigInt {
    let value = this.get("totalBoosters");
    return value.toBigInt();
  }

  set totalBoosters(value: BigInt) {
    this.set("totalBoosters", Value.fromBigInt(value));
  }

  get creationTxHash(): Array<Bytes> {
    let value = this.get("creationTxHash");
    return value.toBytesArray();
  }

  set creationTxHash(value: Array<Bytes>) {
    this.set("creationTxHash", Value.fromBytesArray(value));
  }

  get DiscountUpdateTxHashes(): Array<Bytes> {
    let value = this.get("DiscountUpdateTxHashes");
    return value.toBytesArray();
  }

  set DiscountUpdateTxHashes(value: Array<Bytes>) {
    this.set("DiscountUpdateTxHashes", Value.fromBytesArray(value));
  }

  get _SIGHBoosters(): string {
    let value = this.get("_SIGHBoosters");
    return value.toString();
  }

  set _SIGHBoosters(value: string) {
    this.set("_SIGHBoosters", Value.fromString(value));
  }
}

export class Booster extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Booster entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Booster entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Booster", id.toString(), this);
  }

  static load(id: string): Booster | null {
    return store.get("Booster", id) as Booster | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get boosterID(): BigInt {
    let value = this.get("boosterID");
    return value.toBigInt();
  }

  set boosterID(value: BigInt) {
    this.set("boosterID", Value.fromBigInt(value));
  }

  get category(): string {
    let value = this.get("category");
    return value.toString();
  }

  set category(value: string) {
    this.set("category", Value.fromString(value));
  }

  get owner(): string {
    let value = this.get("owner");
    return value.toString();
  }

  set owner(value: string) {
    this.set("owner", Value.fromString(value));
  }

  get ownerAddress(): Bytes {
    let value = this.get("ownerAddress");
    return value.toBytes();
  }

  set ownerAddress(value: Bytes) {
    this.set("ownerAddress", Value.fromBytes(value));
  }

  get approvedAddress(): Bytes {
    let value = this.get("approvedAddress");
    return value.toBytes();
  }

  set approvedAddress(value: Bytes) {
    this.set("approvedAddress", Value.fromBytes(value));
  }

  get booster_URI(): string {
    let value = this.get("booster_URI");
    return value.toString();
  }

  set booster_URI(value: string) {
    this.set("booster_URI", Value.fromString(value));
  }

  get fuelAvailable(): BigDecimal {
    let value = this.get("fuelAvailable");
    return value.toBigDecimal();
  }

  set fuelAvailable(value: BigDecimal) {
    this.set("fuelAvailable", Value.fromBigDecimal(value));
  }

  get fuelUsed(): BigDecimal {
    let value = this.get("fuelUsed");
    return value.toBigDecimal();
  }

  set fuelUsed(value: BigDecimal) {
    this.set("fuelUsed", Value.fromBigDecimal(value));
  }

  get isBlacklisted(): boolean {
    let value = this.get("isBlacklisted");
    return value.toBoolean();
  }

  set isBlacklisted(value: boolean) {
    this.set("isBlacklisted", Value.fromBoolean(value));
  }

  get creationTxHash(): Array<Bytes> {
    let value = this.get("creationTxHash");
    return value.toBytesArray();
  }

  set creationTxHash(value: Array<Bytes>) {
    this.set("creationTxHash", Value.fromBytesArray(value));
  }

  get blaclistedTxHashes(): Array<Bytes> {
    let value = this.get("blaclistedTxHashes");
    return value.toBytesArray();
  }

  set blaclistedTxHashes(value: Array<Bytes>) {
    this.set("blaclistedTxHashes", Value.fromBytesArray(value));
  }

  get _SIGHBoosters(): string {
    let value = this.get("_SIGHBoosters");
    return value.toString();
  }

  set _SIGHBoosters(value: string) {
    this.set("_SIGHBoosters", Value.fromString(value));
  }
}

export class User extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save User entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save User entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("User", id.toString(), this);
  }

  static load(id: string): User | null {
    return store.get("User", id) as User | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get address(): Bytes {
    let value = this.get("address");
    return value.toBytes();
  }

  set address(value: Bytes) {
    this.set("address", Value.fromBytes(value));
  }

  get boostersOwned(): Array<string> {
    let value = this.get("boostersOwned");
    return value.toStringArray();
  }

  set boostersOwned(value: Array<string>) {
    this.set("boostersOwned", Value.fromStringArray(value));
  }
}

export class BoostersSaleInfo extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save BoostersSaleInfo entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save BoostersSaleInfo entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("BoostersSaleInfo", id.toString(), this);
  }

  static load(id: string): BoostersSaleInfo | null {
    return store.get("BoostersSaleInfo", id) as BoostersSaleInfo | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get BoostersSaleContractAddress(): Bytes {
    let value = this.get("BoostersSaleContractAddress");
    return value.toBytes();
  }

  set BoostersSaleContractAddress(value: Bytes) {
    this.set("BoostersSaleContractAddress", Value.fromBytes(value));
  }

  get categoriesForSale(): Array<string> | null {
    let value = this.get("categoriesForSale");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set categoriesForSale(value: Array<string> | null) {
    if (value === null) {
      this.unset("categoriesForSale");
    } else {
      this.set(
        "categoriesForSale",
        Value.fromStringArray(value as Array<string>)
      );
    }
  }

  get activeTimestamp(): BigInt {
    let value = this.get("activeTimestamp");
    return value.toBigInt();
  }

  set activeTimestamp(value: BigInt) {
    this.set("activeTimestamp", Value.fromBigInt(value));
  }

  get tokenAcceptedForSale(): string {
    let value = this.get("tokenAcceptedForSale");
    return value.toString();
  }

  set tokenAcceptedForSale(value: string) {
    this.set("tokenAcceptedForSale", Value.fromString(value));
  }

  get allTokensAcceptedForSale(): Array<string> | null {
    let value = this.get("allTokensAcceptedForSale");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set allTokensAcceptedForSale(value: Array<string> | null) {
    if (value === null) {
      this.unset("allTokensAcceptedForSale");
    } else {
      this.set(
        "allTokensAcceptedForSale",
        Value.fromStringArray(value as Array<string>)
      );
    }
  }

  get purchasers(): Array<string> | null {
    let value = this.get("purchasers");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set purchasers(value: Array<string> | null) {
    if (value === null) {
      this.unset("purchasers");
    } else {
      this.set("purchasers", Value.fromStringArray(value as Array<string>));
    }
  }

  get adminAddress(): Bytes {
    let value = this.get("adminAddress");
    return value.toBytes();
  }

  set adminAddress(value: Bytes) {
    this.set("adminAddress", Value.fromBytes(value));
  }
}

export class SaleCategories extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save SaleCategories entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save SaleCategories entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("SaleCategories", id.toString(), this);
  }

  static load(id: string): SaleCategories | null {
    return store.get("SaleCategories", id) as SaleCategories | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get name(): string {
    let value = this.get("name");
    return value.toString();
  }

  set name(value: string) {
    this.set("name", Value.fromString(value));
  }

  get allBoosters(): Array<string> | null {
    let value = this.get("allBoosters");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set allBoosters(value: Array<string> | null) {
    if (value === null) {
      this.unset("allBoosters");
    } else {
      this.set("allBoosters", Value.fromStringArray(value as Array<string>));
    }
  }

  get totalBoostersSold(): BigInt {
    let value = this.get("totalBoostersSold");
    return value.toBigInt();
  }

  set totalBoostersSold(value: BigInt) {
    this.set("totalBoostersSold", Value.fromBigInt(value));
  }

  get boostersSoldIDsList(): Array<BigInt> | null {
    let value = this.get("boostersSoldIDsList");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigIntArray();
    }
  }

  set boostersSoldIDsList(value: Array<BigInt> | null) {
    if (value === null) {
      this.unset("boostersSoldIDsList");
    } else {
      this.set(
        "boostersSoldIDsList",
        Value.fromBigIntArray(value as Array<BigInt>)
      );
    }
  }

  get totalBoostersAvailable(): BigInt {
    let value = this.get("totalBoostersAvailable");
    return value.toBigInt();
  }

  set totalBoostersAvailable(value: BigInt) {
    this.set("totalBoostersAvailable", Value.fromBigInt(value));
  }

  get salePrice(): BigDecimal {
    let value = this.get("salePrice");
    return value.toBigDecimal();
  }

  set salePrice(value: BigDecimal) {
    this.set("salePrice", Value.fromBigDecimal(value));
  }

  get saleSession(): string {
    let value = this.get("saleSession");
    return value.toString();
  }

  set saleSession(value: string) {
    this.set("saleSession", Value.fromString(value));
  }
}

export class boosterSaleEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save boosterSaleEntity entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save boosterSaleEntity entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("boosterSaleEntity", id.toString(), this);
  }

  static load(id: string): boosterSaleEntity | null {
    return store.get("boosterSaleEntity", id) as boosterSaleEntity | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get boosterId(): BigInt {
    let value = this.get("boosterId");
    return value.toBigInt();
  }

  set boosterId(value: BigInt) {
    this.set("boosterId", Value.fromBigInt(value));
  }

  get booster(): string {
    let value = this.get("booster");
    return value.toString();
  }

  set booster(value: string) {
    this.set("booster", Value.fromString(value));
  }

  get addedBy(): Bytes {
    let value = this.get("addedBy");
    return value.toBytes();
  }

  set addedBy(value: Bytes) {
    this.set("addedBy", Value.fromBytes(value));
  }

  get saleCategory(): string {
    let value = this.get("saleCategory");
    return value.toString();
  }

  set saleCategory(value: string) {
    this.set("saleCategory", Value.fromString(value));
  }

  get saleTx(): Bytes {
    let value = this.get("saleTx");
    return value.toBytes();
  }

  set saleTx(value: Bytes) {
    this.set("saleTx", Value.fromBytes(value));
  }
}

export class PaymentMode extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save PaymentMode entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save PaymentMode entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("PaymentMode", id.toString(), this);
  }

  static load(id: string): PaymentMode | null {
    return store.get("PaymentMode", id) as PaymentMode | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get address(): Bytes {
    let value = this.get("address");
    return value.toBytes();
  }

  set address(value: Bytes) {
    this.set("address", Value.fromBytes(value));
  }

  get symbol(): string {
    let value = this.get("symbol");
    return value.toString();
  }

  set symbol(value: string) {
    this.set("symbol", Value.fromString(value));
  }

  get decimals(): BigInt {
    let value = this.get("decimals");
    return value.toBigInt();
  }

  set decimals(value: BigInt) {
    this.set("decimals", Value.fromBigInt(value));
  }

  get totalAmountCollected(): BigDecimal {
    let value = this.get("totalAmountCollected");
    return value.toBigDecimal();
  }

  set totalAmountCollected(value: BigDecimal) {
    this.set("totalAmountCollected", Value.fromBigDecimal(value));
  }

  get amountAvailable(): BigDecimal {
    let value = this.get("amountAvailable");
    return value.toBigDecimal();
  }

  set amountAvailable(value: BigDecimal) {
    this.set("amountAvailable", Value.fromBigDecimal(value));
  }

  get amountTransferred(): BigDecimal {
    let value = this.get("amountTransferred");
    return value.toBigDecimal();
  }

  set amountTransferred(value: BigDecimal) {
    this.set("amountTransferred", Value.fromBigDecimal(value));
  }

  get isActive(): boolean {
    let value = this.get("isActive");
    return value.toBoolean();
  }

  set isActive(value: boolean) {
    this.set("isActive", Value.fromBoolean(value));
  }

  get saleSession(): string {
    let value = this.get("saleSession");
    return value.toString();
  }

  set saleSession(value: string) {
    this.set("saleSession", Value.fromString(value));
  }

  get transferTxs(): Array<Bytes> | null {
    let value = this.get("transferTxs");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytesArray();
    }
  }

  set transferTxs(value: Array<Bytes> | null) {
    if (value === null) {
      this.unset("transferTxs");
    } else {
      this.set("transferTxs", Value.fromBytesArray(value as Array<Bytes>));
    }
  }
}

export class BoosterPurchasers extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save BoosterPurchasers entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save BoosterPurchasers entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("BoosterPurchasers", id.toString(), this);
  }

  static load(id: string): BoosterPurchasers | null {
    return store.get("BoosterPurchasers", id) as BoosterPurchasers | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get address(): Bytes {
    let value = this.get("address");
    return value.toBytes();
  }

  set address(value: Bytes) {
    this.set("address", Value.fromBytes(value));
  }

  get SIGH_Rewards(): BigDecimal {
    let value = this.get("SIGH_Rewards");
    return value.toBigDecimal();
  }

  set SIGH_Rewards(value: BigDecimal) {
    this.set("SIGH_Rewards", Value.fromBigDecimal(value));
  }

  get purchaseTxs(): Array<Bytes> {
    let value = this.get("purchaseTxs");
    return value.toBytesArray();
  }

  set purchaseTxs(value: Array<Bytes>) {
    this.set("purchaseTxs", Value.fromBytesArray(value));
  }

  get saleSession(): string {
    let value = this.get("saleSession");
    return value.toString();
  }

  set saleSession(value: string) {
    this.set("saleSession", Value.fromString(value));
  }
}
