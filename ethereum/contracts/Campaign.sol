//SPDX-License-Identifier: Unlicensed
pragma solidity >=0.8.17;

contract CampaignFactory {
    
    struct CampaignDetails {
        string campaignName;
        string campaignDescription;
        address campaignAddress;
        uint deadline;
    }
    CampaignDetails[] public campaigns;

    function createCampaign(string memory _campaignName, string memory _campaignDescription, uint _minimumContribution, uint _target, uint _deadline) public {
        Campaign campaign = new Campaign(_campaignName, _campaignDescription, _minimumContribution, _target, _deadline, msg.sender);
        CampaignDetails storage campaignDetails = campaigns.push();
        campaignDetails.campaignAddress = address(campaign);
        campaignDetails.campaignName = _campaignName;
        campaignDetails.campaignDescription = _campaignDescription;
        campaignDetails.deadline = campaign.deadline();
    }

    function getCampaigns() public view returns(CampaignDetails[] memory) {
        return campaigns;
    }
}

contract Campaign {

    struct Request {
        uint id;
        string description;
        address payable recipient;
        uint value;
        bool completed;
        bool cancelled;
        uint noOfApprovals;
    }

    string public campaignName;
    string public campaignDescription;
    address public manager;
    uint public minimumContribution;
    uint public target;
    uint public deadline;
    uint public noOfContributors;
    uint public totalContribution;
    mapping(address=>uint) public contributors;
    Request[] public requests;
    mapping(address=>bool)[] approversList;
    bool onlyOnce = true;


    constructor(string memory _campaignName, string memory _campaignDescription, uint _minimumContribution, uint _target, uint _deadline, address _manager) {
        campaignName = _campaignName;
        campaignDescription = _campaignDescription;
        minimumContribution = _minimumContribution;
        target = _target;
        deadline = block.timestamp + _deadline;
        manager = _manager;
    }

    modifier onlyManager() {
        require(msg.sender == manager, "Only manager can access this function");
        _;
    }

    function contribute() public payable {
        require(block.timestamp <= deadline, "Deadline has expired");
        require(msg.value >= minimumContribution, "You need to send the minimum contribution amount to part of the campaign");
        if(contributors[msg.sender] == 0) {
            noOfContributors++;
            contributors[msg.sender] = msg.value;
        } else {
            contributors[msg.sender] += msg.value;
        }
        totalContribution += msg.value;
    }

    function createRequest(string memory _description, address payable _recipient, uint _value) public onlyManager {

        Request storage newRequest = requests.push();
        newRequest.description = _description;
        newRequest.recipient =  _recipient;
        newRequest.value = _value;
        newRequest.completed = false;
        newRequest.cancelled = false;
        newRequest.noOfApprovals = 0;
        newRequest.id = requests.length;
        approversList.push();
    }

    function getRequests() public view returns(Request[] memory) {
        return requests;
    }

    function approveRequest(uint _requestIndex) public {
        require(contributors[msg.sender] >= minimumContribution, "You are not entitled to approve this request");

        mapping(address=>bool) storage approvers = approversList[_requestIndex];
        require(approvers[msg.sender] == false, "You have already approved");

        approvers[msg.sender] = true;
        requests[_requestIndex].noOfApprovals++;
    }

    function finaliseRequest(uint _requestIndex) public onlyManager {
        require(block.timestamp > deadline && totalContribution >= target, "You can not approve request now");
        Request storage request = requests[_requestIndex];
        require(request.completed == false, "This request is already processed");
        require(request.cancelled == false, "This request is cancelled");
        require(request.noOfApprovals > noOfContributors / 2, "Not enought members has approved");
        require(address(this).balance >= request.value, "Not enough balance in the contract");

        request.recipient.transfer(request.value);
        request.completed = true;
    }

    function getSummary() public view returns(string memory, string memory, address, uint, uint, uint, uint, uint, uint, uint) {
        return (
            campaignName,
            campaignDescription,
            manager,
            minimumContribution,
            target,
            deadline,
            noOfContributors,
            totalContribution,
            address(this).balance,
            requests.length
        );
    }

    function checkManager(address checker) public view returns(bool) {
        return checker == manager;
    }

    function checkContributor(address checker) public view returns(bool) {
        return contributors[checker] > 0;
    }

    function cancelRequest(uint _requestIndex) public onlyManager {
        require(requests[_requestIndex].completed == false, "You can not delete a completed request");
        Request storage request = requests[_requestIndex];
        request.cancelled = true;
    }

    function refundContribution() public {
        require(block.timestamp > deadline && totalContribution < target, "You can not get a refund now");
        require(contributors[msg.sender] > minimumContribution, "You have not contributed anything");

        payable(msg.sender).transfer(contributors[msg.sender]);
        delete contributors[msg.sender];
        noOfContributors--;
    }
}