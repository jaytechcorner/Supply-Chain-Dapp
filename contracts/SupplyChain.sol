// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {
    enum State { Created, Packed, Shipped, Delivered }

    struct Product {
        uint256 id;
        string name;
        State state;
        address manufacturer;
        address packer;
        address shipper;
        address retailer;
        uint256 timestamp;
    }

    mapping(uint256 => Product) public products;
    uint256 public productCount = 0;

    address public owner;
    mapping(address => bool) public manufacturers;
    mapping(address => bool) public packers;
    mapping(address => bool) public shippers;
    mapping(address => bool) public retailers;

    event ProductAdded(uint256 id, string name, address manufacturer);
    event ProductStateUpdated(uint256 id, State newState, address updatedBy);
    event RoleGranted(address account, string role);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyManufacturer() {
        require(manufacturers[msg.sender], "Only manufacturer can perform this action");
        _;
    }

    modifier onlyPacker() {
        require(packers[msg.sender], "Only packer can perform this action");
        _;
    }

    modifier onlyShipper() {
        require(shippers[msg.sender], "Only shipper can perform this action");
        _;
    }

    modifier onlyRetailer() {
        require(retailers[msg.sender], "Only retailer can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
        manufacturers[msg.sender] = true;
        packers[msg.sender] = true;
        shippers[msg.sender] = true;
        retailers[msg.sender] = true;
    }

    function grantManufacturerRole(address account) public onlyOwner {
        manufacturers[account] = true;
        emit RoleGranted(account, "Manufacturer");
    }

    function grantPackerRole(address account) public onlyOwner {
        packers[account] = true;
        emit RoleGranted(account, "Packer");
    }

    function grantShipperRole(address account) public onlyOwner {
        shippers[account] = true;
        emit RoleGranted(account, "Shipper");
    }

    function grantRetailerRole(address account) public onlyOwner {
        retailers[account] = true;
        emit RoleGranted(account, "Retailer");
    }

    function addProduct(string memory _name) public onlyManufacturer {
        productCount++;
        products[productCount] = Product({
            id: productCount,
            name: _name,
            state: State.Created,
            manufacturer: msg.sender,
            packer: address(0),
            shipper: address(0),
            retailer: address(0),
            timestamp: block.timestamp
        });

        emit ProductAdded(productCount, _name, msg.sender);
    }

    function packProduct(uint256 _productId) public onlyPacker {
        require(_productId > 0 && _productId <= productCount, "Product does not exist");
        require(products[_productId].state == State.Created, "Product must be in Created state");

        products[_productId].state = State.Packed;
        products[_productId].packer = msg.sender;
        products[_productId].timestamp = block.timestamp;

        emit ProductStateUpdated(_productId, State.Packed, msg.sender);
    }

    function shipProduct(uint256 _productId) public onlyShipper {
        require(_productId > 0 && _productId <= productCount, "Product does not exist");
        require(products[_productId].state == State.Packed, "Product must be in Packed state");

        products[_productId].state = State.Shipped;
        products[_productId].shipper = msg.sender;
        products[_productId].timestamp = block.timestamp;

        emit ProductStateUpdated(_productId, State.Shipped, msg.sender);
    }

    function deliverProduct(uint256 _productId) public onlyRetailer {
        require(_productId > 0 && _productId <= productCount, "Product does not exist");
        require(products[_productId].state == State.Shipped, "Product must be in Shipped state");

        products[_productId].state = State.Delivered;
        products[_productId].retailer = msg.sender;
        products[_productId].timestamp = block.timestamp;

        emit ProductStateUpdated(_productId, State.Delivered, msg.sender);
    }

    function getProduct(uint256 _productId) public view returns (
        uint256 id,
        string memory name,
        State state,
        address manufacturer,
        address packer,
        address shipper,
        address retailer,
        uint256 timestamp
    ) {
        require(_productId > 0 && _productId <= productCount, "Product does not exist");
        Product memory product = products[_productId];
        return (
            product.id,
            product.name,
            product.state,
            product.manufacturer,
            product.packer,
            product.shipper,
            product.retailer,
            product.timestamp
        );
    }

    function getAllProducts() public view returns (Product[] memory) {
        Product[] memory allProducts = new Product[](productCount);
        for (uint256 i = 1; i <= productCount; i++) {
            allProducts[i - 1] = products[i];
        }
        return allProducts;
    }
}
