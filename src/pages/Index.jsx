import React, { useState } from "react";
import { Container, VStack, Button, Input, Table, Thead, Tbody, Tr, Th, Td, IconButton } from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";
import Papa from "papaparse";
import { CSVLink } from "react-csv";

const Index = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setHeaders(Object.keys(results.data[0]));
        setData(results.data);
      },
    });
  };

  const handleAddRow = () => {
    setData([...data, {}]);
  };

  const handleRemoveRow = (index) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  const handleCellChange = (rowIndex, columnId, value) => {
    const newData = data.map((row, i) => {
      if (i === rowIndex) {
        return { ...row, [columnId]: value };
      }
      return row;
    });
    setData(newData);
  };

  return (
    <Container centerContent maxW="container.xl" py={10}>
      <VStack spacing={4} width="100%">
        <Input type="file" accept=".csv" onChange={handleFileUpload} />
        <Button onClick={handleAddRow} leftIcon={<FaPlus />}>
          Add Row
        </Button>
        <Table variant="simple">
          <Thead>
            <Tr>
              {headers.map((header) => (
                <Th key={header}>{header}</Th>
              ))}
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((row, rowIndex) => (
              <Tr key={rowIndex}>
                {headers.map((header) => (
                  <Td key={header}>
                    <Input
                      value={row[header] || ""}
                      onChange={(e) => handleCellChange(rowIndex, header, e.target.value)}
                    />
                  </Td>
                ))}
                <Td>
                  <IconButton
                    aria-label="Remove row"
                    icon={<FaTrash />}
                    onClick={() => handleRemoveRow(rowIndex)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Button as={CSVLink} data={data} headers={headers} filename={"edited_data.csv"}>
          Download CSV
        </Button>
      </VStack>
    </Container>
  );
};

export default Index;