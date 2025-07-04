import React from 'react';
import { VStack, Text, Select, Box, Input, Radio } from 'native-base';

import { RadioInput } from '../RadioInput';
import { SelectWithLabel } from '../SelectWithLabel';
import { ConformidadesCheckbox } from '../ConformidadesCheckbox';
import { GrupoEnunciado } from '@/services/requests/enunciados/types';
import useQuestionStore from '@/store/questions';

interface AnswerCardProps {
  enunciadoId: string;
  descricao: string;
  posicao: number;
  grupo: GrupoEnunciado;
  data: any;
  onChange: any;
}

export default function AnswerCard({
  enunciadoId,
  descricao,
  posicao,
  grupo,
  data,
  onChange,
}: AnswerCardProps) {
  const { selectedInitialQuestion } = useQuestionStore(state => state);

  return (
    <VStack space={3} mb={3} pt={2}>
      <Text color="gray.800" fontSize={'lg'} fontWeight={'semibold'} mb={4}>
        {`${posicao}) ${descricao}`}
      </Text>

      <SelectWithLabel
        label="Quantidade analisada"
        // selectedValue={data[posicao]?.qtdAnalisada}
        onValueChange={t => {
          onChange((prevState: any[]) => {
            console.log('prevState', JSON.stringify(prevState, null, 2));
            return prevState?.map((item, index) => {
              if (index + 1 === posicao && item?.grupo === grupo) {
                return {
                  ...item,
                  qtdAnalisada: t,
                  enunciado_id: enunciadoId,
                  form_ptp_id: selectedInitialQuestion?.id,
                  grupo,
                  posicao,
                };
              } else {
                return {
                  qtdAnalisada: t,
                  enunciado_id: enunciadoId,
                  form_ptp_id: selectedInitialQuestion?.id,
                  grupo,
                  posicao,
                };
              }
            });
          });

          //   return [
          //     ...prevState,
          //     (data[posicao] = {
          //       ...data[posicao],
          //       qtdAnalisada: t,
          //       enunciado_id: enunciadoId,
          //       form_ptp_id: selectedInitialQuestion?.id,
          //       grupo,
          //       posicao,
          //     }),
          //   ];

          //   // let answer;

          //   // const answerExists = prevState?.find(a => a?.enunciado_id === enunciadoId);

          //   // console.log('answerExists', answerExists);

          //   // if (answerExists) {
          //   //   answer = { ...answerExists, qtdAnalisada: t };

          //   //   console.log('answerExists updated', answer);

          //   //   const answerIndex = prevState.findIndex(
          //   //     a => a?.enunciado_id === key,
          //   //   );
          //   //   console.log('answerIndex', answerIndex);

          //   //   prevState[answerIndex] = answer;
          //   //   console.log('prevState updated', prevState);

          //   //   return [...prevState];
          //   // } else {
          //   //   answer = {
          //   //     form_ptp_id: selectedInitialQuestion?.id,
          //   //     enunciado_id: enunciadoId,
          //   //     qtdAnalisada: t,
          //   //     codProduto: '',
          //   //     naoConformidade: false,
          //   //     detalheNaoConformidade: [],
          //   //     lote: null,
          //   //     qtdPalletsNaoConforme: 0,
          //   //     qtdCaixasNaoConforme: 0,
          //   //     necessitaCrm: false,
          //   //   };

          //   //   return [...prevState, { ...answer }];
          //   // }
          // });
        }}
        options={Array.from({ length: 30 })?.map((_, index) => (
          <Select.Item
            key={String(index + 1)}
            label={String(index + 1)}
            value={String(index + 1)}
          />
        ))}
      />

      <Box>
        <Text mb={-2} color="gray.750">
          Código Produto
        </Text>
        <Input
          w="full"
          variant="underlined"
          height={14}
          size="md"
          fontSize="md"
          pb={0}
          placeholderTextColor="gray.700"
          // value={data[posicao]?.codigoProduto}
          onChangeText={t => {
            // onChange('codigoProduto', t, posicao)
            onChange((prevState: any[]) => {
              console.log('prevState', JSON.stringify(prevState, null, 2));

              return prevState?.map((item, index) => {
                if (index + 1 === posicao && item?.grupo === grupo) {
                  return {
                    ...item,
                    codProduto: t,
                    enunciado_id: enunciadoId,
                    form_ptp_id: selectedInitialQuestion?.id,
                    grupo,
                    posicao,
                  };
                } else {
                  return {
                    codProduto: t,
                    enunciado_id: enunciadoId,
                    form_ptp_id: selectedInitialQuestion?.id,
                    grupo,
                    posicao,
                  };
                }
              });

              // return [
              //   ...prevState,
              //   (data[posicao] = {
              //     ...data[posicao],
              //     codProduto: t,
              //     enunciado_id: enunciadoId,
              //     form_ptp_id: selectedInitialQuestion?.id,
              //     grupo,
              //   }),
              // ];

              // let answer;

              // const answerExists = prevState?.find(a => a?.enunciado_id === enunciadoId);

              // console.log('answerExists', answerExists);

              // if (answerExists) {
              //   answer = { ...answerExists, codProduto: t };

              //   console.log('answerExists updated', answer);

              //   const answerIndex = prevState.findIndex(
              //     a => a?.enunciado_id === key,
              //   );
              //   console.log('answerIndex', answerIndex);

              //   prevState[answerIndex] = answer;
              //   console.log('prevState updated', prevState);

              //   return [...prevState];
              // }
            });
          }}
          maxLength={10}
          _focus={{ borderColor: 'primary.700' }}
          placeholder=""
          autoComplete="off"
        />
      </Box>

      <Box mb={1} width="100%">
        <Text mb={3} color="gray.750">
          Há não conformidade?
        </Text>
        <Radio.Group
          name="haNaoConformidade"
          // value={data[posicao]?.haNaoConformidade}
          onChange={t => {
            // onChange('haNaoConformidade', t, posicao);

            onChange((prevState: any[]) => {
              console.log('prevState', JSON.stringify(prevState, null, 2));

              return prevState?.map((item, index) => {
                if (index + 1 === posicao && item?.grupo === grupo) {
                  return {
                    ...item,
                    haNaoConformidade: t,
                    enunciado_id: enunciadoId,
                    form_ptp_id: selectedInitialQuestion?.id,
                    grupo,
                    posicao,
                  };
                } else {
                  return {
                    haNaoConformidade: t,
                    enunciado_id: enunciadoId,
                    form_ptp_id: selectedInitialQuestion?.id,
                    grupo,
                    posicao,
                  };
                }
              });

              // return [
              //   ...prevState,
              //   (data[posicao] = {
              //     ...data[posicao],
              //     haNaoConformidade: t,
              //     enunciado_id: enunciadoId,
              //     form_ptp_id: selectedInitialQuestion?.id,
              //     grupo,
              //   }),
              // ];
            });
          }}
          flexDirection="row"
          space={3}
          alignItems={'center'}
          width="100%"
          style={{ gap: 10 }}
        >
          <RadioInput value="sim">
            <Text>Sim</Text>
          </RadioInput>
          <RadioInput value="nao" ml={5}>
            <Text>Não</Text>
          </RadioInput>
        </Radio.Group>
      </Box>

      {data[posicao]?.haNaoConformidade === 'sim' && (
        <Box>
          <Text mb={-2} color="gray.750">
            Lote
          </Text>
          <Input
            w="full"
            variant="underlined"
            height={14}
            size="md"
            fontSize="md"
            pb={0}
            placeholderTextColor="gray.700"
            // value={data[posicao]?.lote}
            onChangeText={t => {
              // onChange('lote', t, posicao);
              onChange((prevState: any[]) => {
                console.log('prevState', JSON.stringify(prevState, null, 2));

                return prevState?.map((item, index) => {
                  if (index + 1 === posicao && item?.grupo === grupo) {
                    return {
                      ...item,
                      lote: t,
                      enunciado_id: enunciadoId,
                      form_ptp_id: selectedInitialQuestion?.id,
                      grupo,
                      posicao,
                    };
                  } else {
                    return {
                      lote: t,
                      enunciado_id: enunciadoId,
                      form_ptp_id: selectedInitialQuestion?.id,
                      grupo,
                      posicao,
                    };
                  }
                });

                // return [
                //   ...prevState,
                //   (data[posicao] = {
                //     ...data[posicao],
                //     lote: t,
                //     enunciado_id: enunciadoId,
                //     form_ptp_id: selectedInitialQuestion?.id,
                //     grupo,
                //   }),
                // ];
              });
            }}
            maxLength={10}
            _focus={{ borderColor: 'primary.700' }}
            placeholder=""
            autoComplete="off"
          />
        </Box>
      )}

      {data[posicao]?.haNaoConformidade === 'sim' && (
        <Box mb={1} width="100%">
          <ConformidadesCheckbox
            listaNaoConformidades={data[posicao]?.listaNaoConformidades}
            setListaNaoConformidades={t => {
              // onChange('listaNaoConformidades', t, posicao);
              onChange((prevState: any[]) => {
                console.log('prevState', JSON.stringify(prevState, null, 2));

                return prevState?.map((item, index) => {
                  if (index + 1 === posicao && item?.grupo === grupo) {
                    return {
                      ...item,
                      listaNaoConformidades: t,
                      enunciado_id: enunciadoId,
                      form_ptp_id: selectedInitialQuestion?.id,
                      grupo,
                      posicao,
                    };
                  } else {
                    return {
                      listaNaoConformidades: t,
                      enunciado_id: enunciadoId,
                      form_ptp_id: selectedInitialQuestion?.id,
                      grupo,
                      posicao,
                    };
                  }
                });

                // return [
                //   ...prevState,
                //   (data[posicao] = {
                //     ...data[posicao],
                //     listaNaoConformidades: t,
                //     enunciado_id: enunciadoId,
                //     form_ptp_id: selectedInitialQuestion?.id,
                //     grupo,
                //   }),
                // ];
              });
            }}
          />
        </Box>
      )}

      <SelectWithLabel
        label="Qtde de pallets não conforme?"
        // selectedValue={data[posicao]?.qtdPalletsNaoConforme}
        onValueChange={t => {
          // onChange('qtdPalletsNaoConforme', t, posicao);
          onChange((prevState: any[]) => {
            console.log('prevState', JSON.stringify(prevState, null, 2));

            return prevState?.map((item, index) => {
              if (index + 1 === posicao && item?.grupo === grupo) {
                return {
                  ...item,
                  qtdPalletsNaoConforme: t,
                  enunciado_id: enunciadoId,
                  form_ptp_id: selectedInitialQuestion?.id,
                  grupo,
                  posicao,
                };
              } else {
                return {
                  qtdPalletsNaoConforme: t,
                  enunciado_id: enunciadoId,
                  form_ptp_id: selectedInitialQuestion?.id,
                  grupo,
                  posicao,
                };
              }
            });

            // return [
            //   ...prevState,
            //   (data[posicao] = {
            //     ...data[posicao],
            //     qtdPalletsNaoConforme: t,
            //     enunciado_id: enunciadoId,
            //     form_ptp_id: selectedInitialQuestion?.id,
            //     grupo,
            //   }),
            // ];
          });
        }}
        options={Array.from({ length: 30 })?.map((_, index) => (
          <Select.Item
            key={String(index + 1)}
            label={String(index + 1)}
            value={String(index + 1)}
          />
        ))}
      />

      <SelectWithLabel
        label="Qtde de caixas não conforme?"
        // selectedValue={data[posicao]?.qtdCaixasNaoConforme}
        onValueChange={t => {
          // onChange('qtdCaixasNaoConforme', t, posicao);
          onChange((prevState: any[]) => {
            console.log('prevState', JSON.stringify(prevState, null, 2));

            return prevState?.map((item, index) => {
              if (index + 1 === posicao && item?.grupo === grupo) {
                return {
                  ...item,
                  qtdCaixasNaoConforme: t,
                  enunciado_id: enunciadoId,
                  form_ptp_id: selectedInitialQuestion?.id,
                  grupo,
                  posicao,
                };
              } else {
                return {
                  qtdCaixasNaoConforme: t,
                  enunciado_id: enunciadoId,
                  form_ptp_id: selectedInitialQuestion?.id,
                  grupo,
                  posicao,
                };
              }
            });

            // return [
            //   ...prevState,
            //   (data[posicao] = {
            //     ...data[posicao],
            //     qtdCaixasNaoConforme: t,
            //     enunciado_id: enunciadoId,
            //     form_ptp_id: selectedInitialQuestion?.id,
            //     grupo,
            //   }),
            // ];
          });
        }}
        options={Array.from({ length: 30 })?.map((_, index) => (
          <Select.Item
            key={String(index + 1)}
            label={String(index + 1)}
            value={String(index + 1)}
          />
        ))}
      />

      {/* <Box mb={1} width="100%">
          <Text mb={3} color="gray.750">
            É necessário abrir CRM?
          </Text>
          <Radio.Group
            name="abrirLaudo"
            value={abrirLaudo}
            onChange={value => setAbrirLaudo(value)}
            flexDirection="row"
            space={3}
            alignItems={'center'}
            width="100%"
            style={{ gap: 10 }}
          >
            <Radio value="sim">
              <Text>Sim</Text>
            </Radio>
            <Radio value="nao" ml={5}>
              <Text>Não</Text>
            </Radio>
          </Radio.Group>
        </Box> */}
    </VStack>
  );
}
