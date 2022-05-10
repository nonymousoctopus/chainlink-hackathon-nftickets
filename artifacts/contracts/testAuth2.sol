// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;


contract VerifySignature {

    function getMessageHash(string memory _message) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_message));
    }

      function getEthSignedMessageHash(bytes32 _messageHash)
        public pure returns (bytes32) {
               return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash)
            );
    }

      function verify(address _signer, string memory _message, bytes memory signature) public pure returns (string memory _result) {
        bytes32 messageHash = getMessageHash(_message);
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);

        //This is the address used for testing that is being checked - will actually be list of NFT owners in real app
        address _testAddress = 0xc88Ad52065A113EbE503a4Cb6bCcE02B4802c264;
        _result = "Not on the list";
        if (_signer == _testAddress && (recoverSigner(ethSignedMessageHash, signature) == _signer)) {
            _result = "On the list";
        } 
        return _result;
    }

    function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _signature) public pure returns (address)
    {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);

        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function splitSignature(bytes memory sig) public pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "invalid signature length");

        assembly {
           
            r := mload(add(sig, 32))
           
            s := mload(add(sig, 64))
           
            v := byte(0, mload(add(sig, 96)))
        }
    }


    function hostActions(string memory _message, bytes memory _sig) public pure returns (string memory) {
        bytes32 _messageHash = getMessageHash(_message);
        bytes32 _ethSignedMessageHash = getEthSignedMessageHash(_messageHash);
        address _signer = recoverSigner(_ethSignedMessageHash, _sig);
        return verify(_signer, _message, _sig);
    }
}
