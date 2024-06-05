import { Fragment, useCallback, useEffect, useState } from "react";
import _ from "lodash";
import { z, ZodObject, ZodString, ZodNumber, ZodEnum, ZodArray } from "zod";
import { UseFormReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import prettier from "prettier/standalone";
import solidityPlugin from "prettier-plugin-solidity/standalone";

import { cn } from "@/lib/utils";
import { getTemplate } from "@/utils/templates";
import { SCHEMAS_MAP, formSchemaDefaultValues } from "./constants";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ExplanationTooltip } from "@/components/ExplanationTooltip";
import { OPTIONS_FIELDS } from "./constants";
import { Separator } from "../ui/separator";
import { useStore } from "@/utils/store";

export const constructForm = (
  form: UseFormReturn<any, any, undefined>,
  schema: ZodObject<any>,
) => {
  const elements = Object.keys(schema.shape).map((key) => {
    const field = schema.shape[key];
    const title = _.startCase(key);
    const helpText = field?.description;

    if (field instanceof ZodString) {
      return (
        <FormField
          key={key}
          control={form.control}
          name={key}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex w-full justify-between">
                {title}
                {helpText && (
                  <ExplanationTooltip>{helpText}</ExplanationTooltip>
                )}
              </FormLabel>
              <FormControl>
                <Input placeholder={title} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    } else if (field instanceof ZodNumber) {
      return (
        <FormField
          key={key}
          control={form.control}
          name={key}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex w-full justify-between">
                {title}
                {helpText && (
                  <ExplanationTooltip>{helpText}</ExplanationTooltip>
                )}
              </FormLabel>
              <FormControl>
                <Input type="number" placeholder={title} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    } else if (field instanceof ZodArray) {
      const options = field._def.type;
      return (
        <Fragment key={key}>
          <FormField
            key={key}
            control={form.control}
            name="features"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="flex items-center justify-between">
                    {title}
                  </FormLabel>
                  {helpText && (
                    <FormDescription>
                      Select the additional features to add.
                    </FormDescription>
                  )}
                </div>

                {options.map((itemId) => {
                  const id = itemId;
                  const label = _.startCase(itemId);
                  const fullKey = `${key}.${itemId}`;
                  const info = _.get(OPTIONS_FIELDS, fullKey)?.info;

                  return (
                    <FormField
                      key={id}
                      control={form.control}
                      name="features"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== id,
                                        ),
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="flex w-full justify-between font-normal">
                              {_.startCase(label)}{" "}
                              {info && (
                                <ExplanationTooltip>{info}</ExplanationTooltip>
                              )}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  );
                })}
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />
        </Fragment>
      );
    } else if (field instanceof ZodEnum) {
      // field value of key
      const fieldValue = form.getValues()[key];

      return (
        <Fragment key={key}>
          <FormField
            control={form.control}
            name={key}
            render={() => (
              <FormItem className="space-y-4">
                <FormLabel className="flex items-center justify-between">
                  {title}
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    value={fieldValue}
                    defaultValue={fieldValue}
                    className="flex flex-col space-y-1"
                  >
                    {field.options.map((itemId, idx) => {
                      const id = itemId;
                      const label = _.startCase(itemId);
                      const fullKey = `${key}.${itemId}`;
                      const info = _.get(OPTIONS_FIELDS, fullKey)?.info;

                      return (
                        <FormItem
                          key={idx}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem
                              onClick={() => {
                                form.setValue(key, id);
                              }}
                              value={id}
                            />
                          </FormControl>
                          <FormLabel
                            className={cn(
                              "flex w-full justify-between font-normal",
                            )}
                          >
                            {label}{" "}
                            {info && (
                              <ExplanationTooltip>{info}</ExplanationTooltip>
                            )}
                          </FormLabel>
                        </FormItem>
                      );
                    })}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />
        </Fragment>
      );
    } else if (field instanceof ZodObject) {
      return (
        <Fragment key={key}>
          {constructForm(form, field)}
          <Separator />
        </Fragment>
      );
    }
  });

  return elements;
};

const formatCode = async (code: string) => {
  const formattedCode = await prettier.format(code, {
    parser: "solidity-parse",
    plugins: [solidityPlugin],
  });

  return formattedCode;
};

export const ContractOptionsForm = () => {
  const setOptionsForm = useStore((state) => state.setOptionsForm);
  const contractType = useStore((state) => state.contractType);
  const library = useStore((state) => state.library);

  const formSchema = SCHEMAS_MAP[contractType];
  const setCode = useStore((state) => state.setCode);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formSchemaDefaultValues,
  });

  useEffect(() => {
    setOptionsForm(form);
  }, [form, setOptionsForm]);

  const onChange = useCallback(async () => {
    const values = form.getValues();
    const template = getTemplate(values, contractType, library);
    const formattedCode = await formatCode(template);

    setCode(formattedCode);
  }, [contractType, form, library, setCode]);

  useEffect(() => {
    onChange();
  }, [contractType, onChange, library]);

  return (
    <Form {...form}>
      <div className="max-h-full overflow-y-auto p-4">
        <form onChange={onChange} className="space-y-6">
          {constructForm(form, formSchema)}
        </form>
      </div>
    </Form>
  );
};

export default ContractOptionsForm;
